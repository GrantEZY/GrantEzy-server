import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";

export class CreateApplicationData {
    application: GrantApplication;
}
export class UserApplications {
    applications: GrantApplication[];
}

export class DeleteApplication {
    success: boolean;
    applicationId: string;
}

export class CreateApplicationResponse extends ApiResponse(
    CreateApplicationData
) {}
export class GetUserApplicationsResponse extends ApiResponse(
    UserApplications
) {}

export class DeleteApplicationResponse extends ApiResponse(DeleteApplication) {}
