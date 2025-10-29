import {Project} from "../../../../core/domain/aggregates/project.aggregate";
import {CreateProjectDTO} from "../../../../infrastructure/driving/dtos/project.management.dto";

export interface ProjectAggregatePort {
    createProject(details: CreateProjectDTO): Promise<Project>;
}

export const PROJECT_AGGREGATE_PORT = Symbol("ProjectAggregatePort");
