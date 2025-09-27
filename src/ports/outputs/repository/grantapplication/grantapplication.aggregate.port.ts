import {GrantApplication} from "../../../../core/domain/aggregates/grantapplication.aggregate";
import {
    AddApplicationRevenueStreamDTO,
    AddApplicationRisksAndMilestonesDTO,
    AddApplicationTechnicalAndMarketInfoDTO,
    AddBudgetDetailsDTO,
    ApplicationDocumentsDTO,
    CreateApplicationRepoDTO,
} from "../../../../infrastructure/driving/dtos/applicant.dto";
import {User} from "../../../../core/domain/aggregates/user.aggregate";
import {GrantApplicationStatus} from "../../../../core/domain/constants/status.constants";
export interface GrantApplicationAggregatePort {
    save(applicationData: CreateApplicationRepoDTO): Promise<GrantApplication>;
    addApplicationBudgetDetails(
        application: GrantApplication,
        budgetDetails: AddBudgetDetailsDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication>;
    addApplicationTechnicalAndMarketInfo(
        application: GrantApplication,
        technicalAndMarketInfo: AddApplicationTechnicalAndMarketInfoDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication>;
    addApplicationRevenueStream(
        application: GrantApplication,
        revenueDetails: AddApplicationRevenueStreamDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication>;
    addApplicationRisksAndMileStones(
        application: GrantApplication,
        risksAndMileStoneDetails: AddApplicationRisksAndMilestonesDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication>;
    addApplicationDocuments(
        application: GrantApplication,
        documentDetail: ApplicationDocumentsDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication>;
    addApplicationTeammates(
        application: GrantApplication,
        teamMateDetails: User[]
    ): Promise<GrantApplication>;
    modifyApplicationStatus(
        application: GrantApplication,
        status: GrantApplicationStatus,
        stepUpdate: boolean
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
