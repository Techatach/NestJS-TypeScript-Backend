import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/Post.schema';
import { CreatePostDto } from './../users/dto/CreatePost.dto';
import { User } from 'src/schemas/User.schema';
import { HttpException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost({ userId, ...createPostDto }: CreatePostDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('Usre Not Found', 404);

    const newPost = new this.postModel(createPostDto);
    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: { posts: savedPost._id },
    });
    return savedPost;
  }

  findPostById() {}
}
