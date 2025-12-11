import {Project} from "../../../../core/domain/aggregates/project.aggregate";
import {ProjectStatus} from "../../../../core/domain/constants/status.constants";
import {CreateProjectDTO} from "../../../../infrastructure/driving/dtos/project.management.dto";

export interface ProjectAggregatePort {
    createProject(details: CreateProjectDTO): Promise<Project>;
    modifyProjectStatus(
        project: Project,
        status: ProjectStatus
    ): Promise<Project>;
    getProjectDetailsWithApplicationId(
        applicationId: string
    ): Promise<Project | null>;
}

export const PROJECT_AGGREGATE_PORT = Symbol("ProjectAggregatePort");
