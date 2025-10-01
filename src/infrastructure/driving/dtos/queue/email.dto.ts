import {IsString, IsEmail} from "class-validator";
import {EmailNotifications} from "../../../../core/domain/constants/notification.constants";

export class InviteEmailDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
export type EmailBody = InviteEmailDTO;

export class EmailWorkerJobDTO {
    type: EmailNotifications;

    data: EmailBody;
}
