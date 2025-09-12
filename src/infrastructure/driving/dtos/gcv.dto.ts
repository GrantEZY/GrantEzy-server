import {
    IsEmail,
    IsInt,
    IsPositive,
    Min,
    IsOptional,
    ValidateNested,
    IsEnum,
    IsObject,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
import {Type} from "class-transformer";
import {UpdateRole} from "./shared/shared.user.dto";

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
