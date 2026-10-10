import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model.js';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "User",
      schema: UserSchema,
    }])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
