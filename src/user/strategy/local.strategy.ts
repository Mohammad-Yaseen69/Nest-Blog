
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service.js';
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from '@nestjs/config';
import { User } from '../models/user.model.js';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger("LocalStrategy", { timestamp: true });

    constructor(
        private userService: UserService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET')!,
            ignoreExpiration: false
        });
    }

    async validate(payload: any): Promise<Omit<User, 'password'>> {
        try {
            const user = await this.userService.findUserForAuth(payload.sub);

            if (!user) {
                this.logger.warn(`User with ID ${payload.sub} not found`);
                throw new UnauthorizedException("Unauthorized to access this route");
            }

            this.logger.log(`User ${user.email} authenticated successfully`);

            return user;
        } catch (error: any) {
            this.logger.error(`Error during user validation: ${error.message}`);
            throw new UnauthorizedException("Unauthorized to access this route");
        }
    }
}
