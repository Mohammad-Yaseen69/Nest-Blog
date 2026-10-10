
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
    timestamps: true
})
export class Comment {
    @Prop({ maxLength: 1000, required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: mongoose.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Post" })
    post: mongoose.Types.ObjectId
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
