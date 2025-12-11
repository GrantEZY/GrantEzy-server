import {IsString, IsEmail, IsEnum, IsObject, IsUUID} from "class-validator";
import {EmailNotifications} from "../../../../core/domain/constants/notification.constants";
import {UserRoles} from "../../../../core/domain/constants/userRoles.constants";
import {ProgramRound} from "../../../../core/domain/value-objects/program.round.object";
import {InviteAs} from "../../../../core/domain/constants/invite.constants";

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
    token: string;

    @IsString()
    slug: string;

    @IsString()
    applicationName: string;

    @IsString()
    invitedBy: string;
}

export class ForgotPasswordEmailDTO {
    @IsEmail()
    email: string;

    @IsUUID()
    token: string;

    @IsString()
    slug: string;
}

export type EmailBody =
    | InviteEmailDTO
    | CycleInviteBodyDTO
    | ForgotPasswordEmailDTO
    | ProjectCreationDTO
    | CycleReviewEmailDTO;

export class EmailWorkerJobDTO {
    type: EmailNotifications;

    data: EmailBody;
}

export class CycleInviteDTO {
    @IsEmail()
    email: string;

    @IsString()
    role: UserRoles.TEAM_MATE | UserRoles.REVIEWER;

    @IsEnum(InviteAs)
    inviteAs: InviteAs;

    @IsString()
    programName: string;

    @IsObject()
    round: ProgramRound;

    @IsString()
    applicationName: string;

    @IsString()
    inviteUrl: string;

    @IsString()
    invitedBy: string;
}

export class ProjectCreationDTO {
    @IsString()
    applicationName: string;

    @IsString()
    userName: string;

    @IsEmail()
    email: string;
}

export class CycleReviewEmailDTO {
    @IsString()
    cycleReviewName: string;

    @IsString()
    reviewBrief: string;

    @IsString()
    userName: string;

    @IsString()
    applicationName: string;

    @IsEmail()
    email: string;
}
