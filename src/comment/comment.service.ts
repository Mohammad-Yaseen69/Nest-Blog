import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './model/comment.model.js';
import { Model } from 'mongoose';
import { PostService } from '../post/post.service.js';
import { IResponse } from '../common/interface/IResponse.js';
import { IPaginationQuery } from '../common/interface/IPaginationQuery.js';

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

  async findPostComments(postId: string, query: IPaginationQuery): Promise<IResponse> {
    await this.postService.findOne(postId)

    const page = Math.max(1, Math.trunc(Number(query.page)) || 1);
    const limit = Math.min(100, Math.max(1, Math.trunc(Number(query.limit)) || 10));
    const comments = await this.commentModel
      .find({ post: postId })
      .populate('author', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDocument = await this.commentModel.countDocuments({ post: postId })

    return {
      statusCode: 200,
      message: "Success",
      data: {
        comments,
        paginationMetadata: {
          currentPage: page,
          limit,
          totalDocument: totalDocument,
          totalPages: Math.ceil(totalDocument / limit)
        }
      }
    };
  }

  async findUserComments(userId: string, query: IPaginationQuery): Promise<IResponse> {
    const page = Math.max(1, Math.trunc(Number(query.page)) || 1);
    const limit = Math.min(100, Math.max(1, Math.trunc(Number(query.limit)) || 10));
    const comments = await this.commentModel
      .find({ author: userId })
      .populate('post')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDocument = await this.commentModel.countDocuments({ author: userId })

    return {
      statusCode: 200,
      message: "Success",
      data: {
        comments,
        paginationMetadata: {
          currentPage: page,
          limit,
          totalDocument: totalDocument,
          totalPages: Math.ceil(totalDocument / limit)
        }
      }
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
      { returnDocument: "after", runValidators: true }
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
