import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsEnum} from "class-validator";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";

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

    @ApiProperty({
        description: "Role for which the person need to be modified",
        example: UserRoles.DIRECTOR,
    })
    @IsEnum(UserRoles)
    role: UserRoles;
}

export class DeleteUserDTO {
    @ApiProperty({
        description: "Email of the person to be deleted",
        example: "inthrak04@gmail.com",
    })
    @IsEmail()
    email: string;
}
