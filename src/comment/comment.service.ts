import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './model/comment.model.js';
import { Model } from 'mongoose';
import { PostService } from '../post/post.service.js';
import { IResponse } from '../common/interface/IResponse.js';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly postService: PostService
  ) { }

  async create(createCommentDto: CreateCommentDto, postId: string, authorId: string): Promise<IResponse> {
    await this.postService.findOne(postId)
    const newComment = new this.commentModel({
      ...createCommentDto,
      post: postId,
      author: authorId
    })

    await newComment.save()

    return {
      statusCode: 201,
      message: "Success",
      data: newComment
    };
  }

  async findPostComments(postId: string): Promise<IResponse> {
    await this.postService.findOne(postId)

    const comments = await this.commentModel
      .find({ post: postId })
      .populate('author', 'firstName lastName email');

    return {
      statusCode: 200,
      message: "Success",
      data: comments
    };
  }

  async findUserComments(userId: string): Promise<IResponse> {
    const comments = await this.commentModel
      .find({ author: userId })
      .populate('post');

    return {
      statusCode: 200,
      message: "Success",
      data: comments
    };
  }

  async findOne(id: string): Promise<IResponse> {
    const comment = await this.commentModel
      .findById(id)
      .populate('author', 'firstName lastName email _id');

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return {
      statusCode: 200,
      message: "Success",
      data: comment
    };
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string, isAdmin: boolean): Promise<IResponse> {
    const { data: comment } = await this.findOne(id);

    if (comment.author?._id?.toString() !== userId && !isAdmin) {
      throw new ForbiddenException("Only author or admin can update this comment");
    }

    const updatedComment = await this.commentModel.findByIdAndUpdate(
      comment._id,
      { $set: updateCommentDto },
      { new: true, runValidators: true }
    );

    return {
      statusCode: 200,
      message: "Success",
      data: updatedComment
    };
  }

  async remove(id: string, userId: string, isAdmin: boolean): Promise<IResponse> {
    const { data: comment } = await this.findOne(id);

    if (comment.author?._id?.toString() !== userId && !isAdmin) {
      throw new ForbiddenException("Only author or admin can delete this comment");
    }

    await this.commentModel.findByIdAndDelete(comment._id);

    return {
      statusCode: 200,
      message: "Success"
    };
  }
}
