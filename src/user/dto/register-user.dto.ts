import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsString({ message: "First name must be a string" })
    @MinLength(2, { message: "First name must be at least 2 characters long" })
    @MaxLength(30, { message: "First name must be at most 30 characters long" })
    @IsNotEmpty({ message: "First name is required" })
    firstName: string;

    @IsString({ message: "Last name must be a string" })
    @MinLength(2, { message: "Last name must be at least 2 characters long" })
    @MaxLength(30, { message: "Last name must be at most 30 characters long" })
    @IsNotEmpty({ message: "Last name is required" })
    lastName: string;

    @IsString({ message: "Email must be a string" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }, { message: "Password must be 8+ characters with an uppercase letter, lowercase letter, and number" })
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}
