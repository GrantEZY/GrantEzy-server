import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {Project} from "../../../core/domain/aggregates/project.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";

export class CreateProjectData {
    applicationId: string;
    projectId: string;
}

export class GetCycleProjects {
    applications: GrantApplication[];
}

export class GetProjectDetails {
    project: Project;
}

export class CreateProjectResponse extends ApiResponse(CreateProjectData) {}
export class GetCycleProjectsResponse extends ApiResponse(GetCycleProjects) {}
export class GetProjectDetailsResponse extends ApiResponse(GetProjectDetails) {}
