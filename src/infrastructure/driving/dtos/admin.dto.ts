import {
    IsInt,
    IsOptional,
    IsPositive,
    Min,
    ValidateNested,
    IsObject,
    IsEnum,
    IsEmail,
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

export class AddUserDTO {
    @ApiProperty({
        description: "Email of the person to be added",
        example: "inthrak04@gmail.com",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Role for which the person need to be added",
        example: UserRoles.DIRECTOR,
    })
    @IsEnum(UserRoles)
    role: UserRoles;
}

export enum UpdateRole {
    ADD_ROLE,
    DELETE_ROLE,
}

export class UpdateUserRoleDTO {
    @ApiProperty({
        description: "Email of the person to be added",
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

    @ApiProperty({
        description: "Role for which the person need to be modified",
        example: UserRoles.DIRECTOR,
    })
    @IsEnum(UserRoles)
    role: UserRoles;
}
