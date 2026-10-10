import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateCommentDto {
    @MaxLength(1000, { message: "Max length of content is 1000 character" })
    @IsNotEmpty({ message: "Comment content is required" })
    content: string
}
