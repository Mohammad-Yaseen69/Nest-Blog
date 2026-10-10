import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { IResponse } from '../common/interface/IResponse.js';
import { LoginUserDto } from './dto/login-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async registerUser(@Body() userData: RegisterUserDto): Promise<IResponse> {
    return await this.userService.registerUser(userData);
  }

  @Post('login')
  async loginUser(@Body() loginData: LoginUserDto): Promise<IResponse> {
    return await this.userService.loginUser(loginData);
  }
}
