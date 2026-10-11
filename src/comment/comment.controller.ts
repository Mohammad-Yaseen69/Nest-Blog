import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { LocalAuthGuard } from '../user/guards/local-auth.guard.js';
import { CurrentUser } from '../user/decorator/current-user.decorator.js';
import type { UserDocument } from '../user/models/user.model.js';
import type { IPaginationQuery } from '../common/interface/IPaginationQuery.js';


@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post(':postId')
  @UseGuards(LocalAuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @CurrentUser() user: UserDocument
  ) {
    return this.commentService.create(createCommentDto, postId, String(user._id));
  }

  @Get('post/:postId')
  findPostComments(
    @Param('postId') postId: string,
    @Query() query: IPaginationQuery
  ) {
    return this.commentService.findPostComments(postId, query);
  }

  @Get('user')
  @UseGuards(LocalAuthGuard)
  findUserComments(
    @CurrentUser() user: UserDocument,
    @Query() query: IPaginationQuery
  ) {
    return this.commentService.findUserComments(user._id.toString(), query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(LocalAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.commentService.update(id, updateCommentDto, String(user._id), user.role === "admin");
  }

  @Delete(':id')
  @UseGuards(LocalAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.commentService.remove(id, String(user._id), user.role === "admin");
  }
}
