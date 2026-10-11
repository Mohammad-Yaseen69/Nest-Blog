import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { LocalAuthGuard } from '../user/guards/local-auth.guard.js';
import { CurrentUser } from '../user/decorator/current-user.decorator.js';
import type { UserDocument } from '../user/models/user.model.js';
import type { IPaginationQuery } from '../common/interface/IPaginationQuery.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseGuards(LocalAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: UserDocument) {
    return this.postService.create(createPostDto, String(user._id));
  }

  @Post("img/:id")
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.postService.uploadImage(id, String(user._id), file);
  }


  @Get()
  findAll(@Query() query: IPaginationQuery) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(LocalAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.postService.update(id, updatePostDto, String(user._id));
  }

  @Delete(':id')
  @UseGuards(LocalAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument
  ) {
    return this.postService.remove(id, String(user._id), user.role === "admin");
  }
}
