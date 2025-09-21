import {GrantApplication} from "../../../../core/domain/aggregates/grantapplication.aggregate";
import {
    AddApplicationRevenueStreamDTO,
    AddApplicationRisksAndMilestonesDTO,
    AddBudgetAndTechnicalDetailsDTO,
    CreateApplicationRepoDTO,
} from "../../../../infrastructure/driving/dtos/applicant.dto";
import {User} from "../../../../core/domain/aggregates/user.aggregate";
export interface GrantApplicationAggregatePort {
    save(applicationData: CreateApplicationRepoDTO): Promise<GrantApplication>;
    addApplicationBudgetDetails(
        application: GrantApplication,
        budgetDetails: AddBudgetAndTechnicalDetailsDTO
    ): Promise<GrantApplication>;
    addApplicationRevenueStream(
        application: GrantApplication,
        revenueDetails: AddApplicationRevenueStreamDTO
    ): Promise<GrantApplication>;
    addApplicationRisksAndMileStones(
        application: GrantApplication,
        risksAndMileStoneDetails: AddApplicationRisksAndMilestonesDTO
    ): Promise<GrantApplication>;
    addApplicationTeammates(
        application: GrantApplication,
        teamMateDetails: User[]
    ): Promise<GrantApplication>;
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
