import {IsString, IsEmail, IsEnum, IsObject} from "class-validator";
import {EmailNotifications} from "../../../../core/domain/constants/notification.constants";
import {UserRoles} from "../../../../core/domain/constants/userRoles.constants";
import {ProgramRound} from "../../../../core/domain/value-objects/program.round.object";

export class InviteEmailDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum({enum: UserRoles})
    role: UserRoles;
}

export class CycleInviteBodyDTO {
    @IsEmail()
    email: string;

    @IsString()
    userName: string;

    @IsString()
    role: UserRoles.TEAM_MATE | UserRoles.REVIEWER;

    @IsString()
    programName: string;

    @IsObject()
    round: ProgramRound;

    @IsString()
    applicationName: string;

    @IsString()
    invitedBy: string;
}

export type EmailBody = InviteEmailDTO | CycleInviteBodyDTO;

export class EmailWorkerJobDTO {
    type: EmailNotifications;

    data: EmailBody;
}

export class CycleInviteDTO {
    @IsEmail()
    email: string;

    @IsString()
    role: UserRoles.TEAM_MATE | UserRoles.REVIEWER;

    @IsString()
    programName: string;

    @IsObject()
    round: ProgramRound;

    @IsString()
    applicationName: string;

    @IsString()
    invitedBy: string;
}
