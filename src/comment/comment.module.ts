import { Module } from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CommentController } from './comment.controller.js';
import { PostModule } from '../post/post.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './model/comment.model.js';

@Module({
  imports: [
    PostModule,
    MongooseModule.forFeature([{
      name: "Comment",
      schema: CommentSchema,
    }]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
