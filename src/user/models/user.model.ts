
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from '../../post/model/post.model.js';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

@Schema({
    timestamps: true
})
export class User {
    @Prop({
        required: true,
        maxLength: 30
    })
    firstName: string;

    @Prop({
        required: true,
        maxLength: 30
    })
    lastName: string;

    @Prop({
        required: true,
        unique: true
    })
    email: string;
    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        default: UserRole.USER,
        enum: UserRole
    })
    role: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    posts: Post[]
}

export const UserSchema = SchemaFactory.createForClass(User);
