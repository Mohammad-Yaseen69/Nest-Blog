import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy.js';
import { RolesGuard } from './guards/roles.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "User",
      schema: UserSchema,
    }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRATION_TIME) || 3600
      }
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, RolesGuard],
  exports: [UserService, LocalStrategy, RolesGuard]
})
export class UserModule { }
