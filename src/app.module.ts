import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from "@nestjs/config"
import { UserModule } from './user/user.module.js';
import { MongooseModule } from "@nestjs/mongoose"
import joi from "joi"
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        PORT: joi.number().default(3000),
        DATABASE_URL: joi.string().required(),
        JWT_SECRET: joi.string().required(),
        JWT_EXPIRATION_TIME: joi.number().required(),
      })
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRATION_TIME) || 3600
      }
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
