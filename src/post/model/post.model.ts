
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/models/user.model.js';

export type PostDocument = HydratedDocument<Post>;


@Schema({
    timestamps: true
})
export class Post {
    @Prop({ required: true, maxLength: 100 })
    title: string;

    @Prop({ maxLength: 1000 })
    content: string;

    @Prop({ default: 0 })
    views: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User
}

export const PostSchema = SchemaFactory.createForClass(Post);
