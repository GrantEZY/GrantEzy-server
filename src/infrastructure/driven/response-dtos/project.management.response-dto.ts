import {ApiResponse} from "../../../shared/types/response.type";

export class CreateProjectData {
    applicationId: string;
    projectId: string;
}

export class CreateProjectReponse extends ApiResponse(CreateProjectData) {}
