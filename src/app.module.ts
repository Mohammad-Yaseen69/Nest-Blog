import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { UserModule } from './user/user.module.js';
import { MongooseModule } from "@nestjs/mongoose"
import joi from "joi"
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './post/post.module.js';
import { CommentModule } from './comment/comment.module.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GlobalThrottlerGuard } from './common/guards/global-rate-limit.guard.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        PORT: joi.number().default(3000),
        DATABASE_URL: joi.string().required(),
        JWT_SECRET: joi.string().required(),
        JWT_EXPIRATION_TIME: joi.number().required(),
        CLOUDINARY_CLOUD_NAME: joi.string().required(),
        CLOUDINARY_API_KEY: joi.string().required(),
        CLOUDINARY_API_SECRET: joi.string().required()
      })
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRATION_TIME) || 3600
      }
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('DATABASE_URL'),
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,

        },
      ],
    }),
    UserModule,
    PostModule,
    CommentModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalThrottlerGuard,
    },
  ],
})
export class AppModule { }
