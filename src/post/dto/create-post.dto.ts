import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePostDto {
    @MaxLength(100, { message: "Max length for title is 100 character" })
    @IsString({ message: "Title must be a string" })
    @IsNotEmpty({ message: "Title is required" })
    title: string;

    @MaxLength(1000, { message: "Max content for title is 1000 character" })
    @IsString({ message: "Content must be a string" })
    content: string;
}
