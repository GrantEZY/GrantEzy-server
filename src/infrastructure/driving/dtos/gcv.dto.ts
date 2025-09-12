import {IsEmail} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class GCVMemberDeleteUserDTO {
    @ApiProperty({
        description: "Email of the person to be deleted",
        example: "inthrak04@gmail.com",
    })
    @IsEmail()
    email: string;
}
