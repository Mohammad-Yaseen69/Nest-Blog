import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { IResponse } from '../common/interface/IResponse.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './model/post.model.js';
import { IPaginationQuery } from '../common/interface/IPaginationQuery.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { Comment } from '../comment/model/comment.model.js';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async create(createPostDto: CreatePostDto, userId: string): Promise<IResponse> {
    const newPost = new this.postModel({
      ...createPostDto,
      author: userId
    })

    await newPost.save()

    return {
      statusCode: 201,
      message: "Post created successfully",
      data: newPost
    }
  }

  async findAll(query: IPaginationQuery): Promise<IResponse> {
    const page = Math.max(1, Math.trunc(Number(query.page)) || 1);
    const limit = Math.min(100, Math.max(1, Math.trunc(Number(query.limit)) || 10));

    const searchQuery = query.query

    const filter = searchQuery
      ? {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { content: { $regex: searchQuery, $options: 'i' } },
        ],
      }
      : {};

    const allPost = await this.postModel
      .find(filter)
      .populate('author', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDocument = await this.postModel.countDocuments(filter)


    return {
      statusCode: 200,
      message: "Success",
      data: {
        allPost,
        paginationMetadata: {
          currentPage: page,
          limit,
          totalDocument: totalDocument,
          totalPages: Math.ceil(totalDocument / limit)
        }
      }
    }
  }

  async findOne(id: string): Promise<IResponse> {
    const post = await this.postModel.findOne({
      _id: id
    }).populate('author', 'firstName lastName email _id')

    if (!post) {
      throw new NotFoundException("Post not found")
    }

    return {
      statusCode: 200,
      message: "Success",
      data: post
    }
  }

  async update(id: string, updatePostData: UpdatePostDto, userId: string): Promise<IResponse> {
    const { data: post } = await this.findOne(id)


    if (post.author?._id?.toString() !== userId) {
      throw new ForbiddenException("Only author can update this post")
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(post._id, { $set: updatePostData }, {
      new: true
    })

    return {
      statusCode: 200,
      message: "Success",
      data: updatedPost
    }
  }

  async uploadImage(id: string, userId: string, file: Express.Multer.File): Promise<IResponse> {
    const { data: post } = await this.findOne(id)


    if (post.author?._id?.toString() !== userId) {
      throw new ForbiddenException("Only author can update this post")
    }

    const result = await this.cloudinaryService.uploadImage(file)

    if (post.publicFileId) {
      await this.cloudinaryService.deleteImage(post.publicFileId)
    }


    post.publicFileId = result.public_id
    post.fileUrl = result.secure_url
    await post.save()


    return {
      statusCode: 200,
      message: "Success",
      data: post
    }
  }

  async remove(id: string, userId: string, isAdmin: boolean): Promise<IResponse> {
    const { data: post } = await this.findOne(id)

    if (post.author?._id?.toString() !== userId && !isAdmin) {
      throw new ForbiddenException("Only author or admin can delete this post")
    }

    if (post.publicFileId) {
      await this.cloudinaryService.deleteImage(post.publicFileId)
    }

    await this.commentModel.deleteMany({ post: post._id })
    await this.postModel.findByIdAndDelete(post._id)

    return {
      statusCode: 200,
      message: "Success"
    }
  }
}
