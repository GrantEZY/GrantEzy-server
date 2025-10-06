import {ApiPropertyOptional} from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsEmail,
    IsOptional,
    IsEnum,
    ValidateNested,
    IsArray,
} from "class-validator";
import {Type} from "class-transformer";
import {UserCommitmentStatus} from "../../../core/domain/constants/commitment.constants";

export class ExperienceDTO {
    @ApiPropertyOptional({example: "ABC", description: "Company name"})
    @IsString()
    @IsNotEmpty()
    company: string;

    @ApiPropertyOptional({
        example: "Software Engineer",
        description: "Position or role",
    })
    @IsString()
    @IsNotEmpty()
    position: string;

    @ApiPropertyOptional({example: "2022-01-01", description: "Start date"})
    @IsString()
    @IsNotEmpty()
    startDate: string;

    @ApiPropertyOptional({
        example: "2023-01-01",
        description: "End date (optional)",
    })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiPropertyOptional({
        example: "Worked on AI projects",
        description: "Description of work",
    })
    @IsOptional()
    @IsString()
    description: string;
}

export class UpdateProfileDTO {
    @ApiPropertyOptional({
        example: "Tyler",
        description: "User's first name",
    })
    @IsString({message: "First name must be a string"})
    @IsOptional()
    @MinLength(3, {message: "First name must be at least 3 characters"})
    @MaxLength(30, {message: "First name must be at most 30 characters"})
    firstName?: string;

    @ApiPropertyOptional({
        example: "Durden",
        description: "User's last name",
    })
    @IsString({message: "Last name must be a string"})
    @IsOptional()
    @MinLength(1, {message: "Last name must be at least 1 character"})
    @MaxLength(30, {message: "Last name must be at most 30 characters"})
    lastName?: string;

    @ApiPropertyOptional({
        example: "TylerDurden@gmail.com",
        description: "User's email address",
    })
    @IsOptional()
    @IsEmail()
    @IsNotEmpty({message: "Email is required"})
    email?: string;

    @ApiPropertyOptional({
        example: "+91 9500040431",
        description: "User's phone number",
    })
    @IsString({message: "Phone must be a string"})
    @IsOptional()
    @MinLength(10, {message: "Phone Number must be at least 1 character"})
    @MaxLength(15, {message: "Phone Number must be at most 15 characters"})
    phone?: string;

    @ApiPropertyOptional({
        example: "user address",
        description: "User's address",
    })
    @IsString({message: "Address must be a string"})
    @IsOptional()
    @MinLength(10, {message: "Address must be at least 1 character"})
    @MaxLength(200, {message: "Address must be at most 200 characters"})
    address?: string;

    @ApiPropertyOptional({
        example: UserCommitmentStatus.FULL_TIME,
        description: "User commitment status",
    })
    @IsOptional()
    @IsEnum(UserCommitmentStatus, {
        message: "Commitment must be a valid enum value",
    })
    commitment?: UserCommitmentStatus;

    @ApiPropertyOptional({
        description: "List of user experiences",
        type: [ExperienceDTO],
        example: [
            {
                company: "OpenAI",
                position: "Researcher",
                startDate: "2022-01-01",
                endDate: "2023-01-01",
                description: "Worked on GPT models",
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ExperienceDTO)
    experiences?: ExperienceDTO[];
}
