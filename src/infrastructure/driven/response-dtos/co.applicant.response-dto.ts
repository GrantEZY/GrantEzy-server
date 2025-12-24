import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {
    InviteAs,
    InviteStatus,
} from "../../../core/domain/constants/invite.constants";
import {ApiResponse} from "../../../shared/types/response.type";
import {Project} from "../../../core/domain/aggregates/project.aggregate";
export class CoApplicantApplicationDetails {
    application: GrantApplication;
}

export class TokenVerificationDetails {
    invitedAt: Date;
    inviteAs: InviteAs;
    application: {
        name: string;
        problem: string;
    };
}

export class GetUserLinkedProjects {
    applications: GrantApplication[];
}

export class GetProjectDetails {
    project: Project;
}

export class UserInviteStatusUpdate {
    applicationId: string;
    status: InviteStatus;
}

export class ManageCoApplicantDetails {
    status: boolean;
}

export class CoApplicantApplicationResponse extends ApiResponse(
    CoApplicantApplicationDetails
) {}

export class TokenVerificationResponse extends ApiResponse(
    TokenVerificationDetails
) {}

export class UserInviteStatusUpdateResponse extends ApiResponse(
    UserInviteStatusUpdate
) {}

export class GetUserProjectsResponse extends ApiResponse(
    GetUserLinkedProjects
) {}

export class GetProjectDetailsResponse extends ApiResponse(GetProjectDetails) {}

export class ManageCoApplicantResponse extends ApiResponse(
    ManageCoApplicantDetails
) {}
