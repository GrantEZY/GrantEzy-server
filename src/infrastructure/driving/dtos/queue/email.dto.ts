import {IsString, IsEmail, IsEnum} from "class-validator";
import {EmailNotifications} from "../../../../core/domain/constants/notification.constants";
import {UserRoles} from "../../../../core/domain/constants/userRoles.constants";

export class InviteEmailDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum({enum: UserRoles})
    role: UserRoles;
}
export type EmailBody = InviteEmailDTO;

export class EmailWorkerJobDTO {
    type: EmailNotifications;

    data: EmailBody;
}
