import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { IResponse } from '../common/interface/IResponse.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './model/post.model.js';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

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

  async findAll(): Promise<IResponse> {
    const allPost = await this.postModel.find().populate('author', 'firstName lastName email')

    return {
      statusCode: 200,
      message: "Success",
      data: allPost
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


    console.log(post.author, userId)
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

  async remove(id: string, userId: string, isAdmin: boolean): Promise<IResponse> {
    const { data: post } = await this.findOne(id)

    if (post.author?._id?.toString() !== userId && !isAdmin) {
      throw new ForbiddenException("Only author or admin can delete this post")
    }

    await this.postModel.findByIdAndDelete(post._id)

    return {
      statusCode: 200,
      message: "Success"
    }
  }
}
