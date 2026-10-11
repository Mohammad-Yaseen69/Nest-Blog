import { Module } from '@nestjs/common';
import { PostService } from './post.service.js';
import { PostController } from './post.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './model/post.model.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { CommentSchema } from '../comment/model/comment.model.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Post",
        schema: PostSchema,
      },
      {
        name: "Comment",
        schema: CommentSchema,
      }
    ]),
    CloudinaryModule
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule { }
