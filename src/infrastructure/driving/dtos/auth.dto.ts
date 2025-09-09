/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsStrongPassword,
    MinLength,
    MaxLength,
    IsEnum,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

import {UserCommitmentStatus} from "../../../core/domain/constants/commitment.constants";

export class RegisterDTO {
    @ApiProperty({
        example: "Tyler",
        description: "User's first name",
    })
    @IsString({message: "First name must be a string"})
    @IsNotEmpty({message: "First name is required"})
    @MinLength(3, {message: "First name must be at least 3 characters"})
    @MaxLength(30, {message: "First name must be at most 30 characters"})
    firstName: string;

    @ApiProperty({
        example: "Durden",
        description: "User's last name",
    })
    @IsString({message: "Last name must be a string"})
    @IsNotEmpty({message: "Last name is required"})
    @MinLength(1, {message: "Last name must be at least 1 character"})
    @MaxLength(30, {message: "Last name must be at most 30 characters"})
    lastName: string;

    @ApiProperty({
        example: "TylerDurden@gmail.com",
        description: "User's email address",
    })
    @IsEmail()
    @IsNotEmpty({message: "Email is required"})
    email: string;

    @ApiProperty({
        example: UserCommitmentStatus.FULL_TIME,
        description: "User's Commitment",
    })
    @IsEnum(UserCommitmentStatus, {
        message: "Commitment must be a valid enum value",
    })
    commitment: UserCommitmentStatus;

    @ApiProperty({
        example: "StrongPassword123!",
        description: "User's password",
        minLength: 8,
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}

export class LoginDTO {
    @ApiProperty({
        example: "tylerdurden@gmail.com",
        description: "User's email address",
    })
    @IsEmail()
    @IsNotEmpty({message: "Email is required"})
    email: string;

    @ApiProperty({description: "User's Role", example: "ADMIN"})
    @IsString()
    @IsNotEmpty({message: "Role is required"})
    role: string;

    @ApiProperty({
        example: "StrongPassword123!",
        description: "User's password",
        minLength: 8,
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}
