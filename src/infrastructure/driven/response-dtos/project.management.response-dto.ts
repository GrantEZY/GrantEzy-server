import {CycleAssessmentAggregate} from "../../../core/domain/aggregates/cycle.assessment.aggregate";
import {CycleAssessmentCriteriaAggregate} from "../../../core/domain/aggregates/cycle.assessment.criteria.aggregate";
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

export class CreateCriteriaDetails {
    criteriaName: string;
}

export class CycleCriteriasDetails {
    criterias: CycleAssessmentCriteriaAggregate[];
}

export class CycleAssessmentForApplicantDetails {
    criteria: CycleAssessmentCriteriaAggregate;
    cycleSubmission: CycleAssessmentAggregate | null;
}

export class CreateProjectResponse extends ApiResponse(CreateProjectData) {}
export class GetCycleProjectsResponse extends ApiResponse(GetCycleProjects) {}
export class GetProjectDetailsResponse extends ApiResponse(GetProjectDetails) {}
export class CreateCriteriaResponse extends ApiResponse(
    CreateCriteriaDetails
) {}
export class GetCycleAssessmentCriteriasResponse extends ApiResponse(
    CycleCriteriasDetails
) {}
export class GetCycleAssessmentDetailsForApplicantResponse extends ApiResponse(
    CycleAssessmentForApplicantDetails
) {}
