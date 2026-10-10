import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
    @IsString({ message: "Email must be a string" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }, { message: "Password must be 8+ characters with an uppercase letter, lowercase letter, and number" })
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}
