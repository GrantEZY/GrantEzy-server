import {GrantApplication} from "../../../../core/domain/aggregates/grantapplication.aggregate";
import {CreateApplicationRepoDTO} from "../../../../infrastructure/driving/dtos/applicant.dto";
export interface GrantApplicationAggregatePort {
    save(applicationData: CreateApplicationRepoDTO): Promise<GrantApplication>;
    findById(id: string): Promise<GrantApplication | null>;
    findBySlug(slug: string): Promise<GrantApplication | null>;
    getUserApplications(userId: string): Promise<GrantApplication[]>;
    deleteApplication(
        oldApplication: GrantApplication
    ): Promise<GrantApplication>;
    findUserCycleApplication(
        userId: string,
        cycleId: string
    ): Promise<GrantApplication | null>;
}

export const GRANT_APPLICATION_AGGREGATE_PORT = Symbol(
    "GrantApplicationAggregatePort"
);
