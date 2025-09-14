import {
    IsEmail,
    IsInt,
    IsPositive,
    Min,
    IsOptional,
    ValidateNested,
    IsEnum,
    IsObject,
    IsString,
    IsDate,
    IsNumber,
} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
import {Type} from "class-transformer";
import {UpdateRole} from "./shared/shared.user.dto";
import {TRL} from "../../../core/domain/constants/trl.constants";
import {ProgramStatus} from "../../../core/domain/constants/status.constants";
import {OrganisationType} from "../../../core/domain/constants/organization.constants";

export class UserFilterDto {
    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;

    @IsOptional()
    @IsObject()
    otherFilters?: Record<string, any>; // eslint-disable-line
}

export class GCVMemberAddDTO {
    @ApiProperty({
        description: "Email of the person to be added",
        example: "tylerdurden@gmail.com",
    })
    @IsEmail()
    email: string;
}

export class GetAllGCVUsersDTO {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        description: "Page Number for pagination",
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: "Number Of Results per page for pagination",
        example: 1,
    })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    numberOfResults: number;

    @ApiProperty({
        description: "Filter Details for pagination",
        example: {role: UserRoles.PROGRAM_MANAGER},
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UserFilterDto)
    filter?: UserFilterDto;
}

export class UpdateGCVUserRoleDTO {
    @ApiProperty({
        description: "Email of the person to be updated",
        example: "inthrak04@gmail.com",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Add or Delete of Role",
        example: UpdateRole.ADD_ROLE,
    })
    @IsEnum(UpdateRole)
    type: UpdateRole;
}

export class ProgramDetailsDTO {
    @ApiProperty({example: "AI Innovation Program"})
    @IsString()
    name: string;

    @ApiProperty({example: "A program to fund AI research"})
    @IsString()
    description: string;

    @ApiProperty({example: "Research"})
    @IsString()
    category: string;
}

export class DurationDTO {
    @ApiProperty({type: Date, example: "2025-01-01T00:00:00Z"})
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiPropertyOptional({type: Date, example: "2025-12-31T23:59:59Z"})
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date | null;
}

export class MoneyDTO {
    @ApiProperty({example: 1000000})
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({example: "USD"})
    @IsString()
    currency: string;
}

export class OrganizationDetails {
    @ApiProperty({
        type: String,
        example: "IIITS",
    })
    name: string;

    @ApiProperty({
        enum: OrganisationType,
        example: "IIIT",
    })
    type?: OrganisationType;

    @ApiProperty({
        type: Boolean,
        example: true,
    })
    isNew: boolean;
}

// -------- Input DTOs --------

export class CreateProgramDTO {
    @ApiProperty({type: OrganizationDetails})
    @ValidateNested()
    @Type(() => OrganizationDetails)
    organization: OrganizationDetails;

    @ApiProperty({type: ProgramDetailsDTO})
    @ValidateNested()
    @Type(() => ProgramDetailsDTO)
    details: ProgramDetailsDTO;

    @ApiProperty({type: DurationDTO})
    @ValidateNested()
    @Type(() => DurationDTO)
    duration: DurationDTO;

    @ApiProperty({enum: ProgramStatus})
    @IsEnum(ProgramStatus)
    status: ProgramStatus;

    @ApiProperty({type: MoneyDTO})
    @ValidateNested()
    @Type(() => MoneyDTO)
    budget: MoneyDTO;

    @ApiProperty({enum: TRL})
    @IsEnum(TRL)
    minTRL: TRL;

    @ApiProperty({enum: TRL})
    @IsEnum(TRL)
    maxTRL: TRL;
}

export class UpdateProgramDTO {
    @ApiPropertyOptional({type: ProgramDetailsDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => ProgramDetailsDTO)
    details?: ProgramDetailsDTO;

    @ApiPropertyOptional({type: DurationDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => DurationDTO)
    duration?: DurationDTO;

    @ApiPropertyOptional({enum: ProgramStatus})
    @IsOptional()
    @IsEnum(ProgramStatus)
    status?: ProgramStatus;

    @ApiPropertyOptional({type: MoneyDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => MoneyDTO)
    budget?: MoneyDTO;

    @ApiPropertyOptional({enum: TRL})
    @IsOptional()
    @IsEnum(TRL)
    minTRL?: TRL;

    @ApiPropertyOptional({enum: TRL})
    @IsOptional()
    @IsEnum(TRL)
    maxTRL?: TRL;
}
