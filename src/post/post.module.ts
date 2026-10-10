import { Module } from '@nestjs/common';
import { PostService } from './post.service.js';
import { PostController } from './post.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './model/post.model.js';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "Post",
      schema: PostSchema,
    }])
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }
