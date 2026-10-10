import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model.js';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { IResponse } from '../common/interface/IResponse.js';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async registerUser(userData: RegisterUserDto): Promise<IResponse> {
        const existCheck = await this.userModel.findOne({ email: userData.email });

        if (existCheck) {
            throw new ConflictException("Email already exists");
        }

        const hashedPassword = await this.hashPassword(userData.password);

        const newUser = new this.userModel({
            ...userData,
            password: hashedPassword
        });

        await newUser.save();

        const { password, ...userWithoutPassword } = newUser.toObject();

        return {
            message: "User registered successfully",
            statusCode: 201,
            data: userWithoutPassword
        }
    }

    async loginUser(loginData: LoginUserDto): Promise<IResponse> {
        const user = await this.userModel.findOne({ email: loginData.email });

        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const isPasswordValid = await this.comparePassword(loginData.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const token = await this.generateToken(user);

        const { password, ...userWithoutPassword } = user.toObject();


        return {
            message: "User logged in successfully",
            statusCode: 200,
            data: {
                token,
                user: userWithoutPassword
            }
        }
    }

    async getUserById(userId: string): Promise<IResponse> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const { password, ...userWithoutPassword } = user.toObject();

        return {
            message: "User fetched successfully",
            statusCode: 200,
            data: userWithoutPassword
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    async generateToken(user: UserDocument): Promise<string> {
        const payload = { email: user.email, sub: user._id };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<number>('JWT_EXPIRATION_TIME')
        });
    }
}
