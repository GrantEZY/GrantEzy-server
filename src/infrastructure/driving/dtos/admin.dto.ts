import {
    IsInt,
    IsOptional,
    IsPositive,
    Min,
    ValidateNested,
    IsObject,
    IsEnum,
    IsString,
} from "class-validator";
import {Type} from "class-transformer";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
import {ApiProperty} from "@nestjs/swagger";

export class UserFilterDto {
    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;

    @IsOptional()
    @IsObject()
    otherFilters?: Record<string, any>; // eslint-disable-line
}

export class GetAllUsersDTO {
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

export class GetUserProfileDTO {
    @IsString()
    @ApiProperty({
        description: "User slug to find the user",
        example: "24598273459sfgsdfgs7899779",
    })
    userSlug: string;
}
