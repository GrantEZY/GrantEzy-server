import {Cycle} from "../../../core/domain/aggregates/cycle.aggregate";
import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {Project} from "../../../core/domain/aggregates/project.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";

export class CreateApplicationData {
    application: GrantApplication;
}
export class UserApplications {
    myApplications: GrantApplication[];
    linkedApplications: GrantApplication[];
}

export class DeleteApplication {
    success: boolean;
    applicationId: string;
}

export class GetApplicationWithCycleDetails {
    cycle: Cycle;
    applicationDetails: GrantApplication | null;
}

export class GetUserApplicationData {
    application: GrantApplication;
}

export class GetUserProjects {
    applications: GrantApplication[];
}

export class GetProjectDetails {
    project: Project;
}

export class CreateApplicationResponse extends ApiResponse(
    CreateApplicationData
) {}
export class GetUserApplicationsResponse extends ApiResponse(
    UserApplications
) {}

export class DeleteApplicationResponse extends ApiResponse(DeleteApplication) {}
export class GetApplicationWithCycleDetailsResponse extends ApiResponse(
    GetApplicationWithCycleDetails
) {}

export class GetUserCreatedApplicationResponse extends ApiResponse(
    GetUserApplicationData
) {}

export class GetUserProjectsResponse extends ApiResponse(GetUserProjects) {}

export class GetProjectDetailsResponse extends ApiResponse(GetProjectDetails) {}
