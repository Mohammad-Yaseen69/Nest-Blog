import { Module } from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CommentController } from './comment.controller.js';
import { PostModule } from '../post/post.module.js';

@Module({
  imports: [PostModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
