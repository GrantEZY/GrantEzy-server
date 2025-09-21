import {GrantApplicationAggregatePort} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {Injectable} from "@nestjs/common";
import {GrantApplication} from "../../../../core/domain/aggregates/grantapplication.aggregate";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {
    AddApplicationRevenueStreamDTO,
    AddApplicationRisksAndMilestonesDTO,
    AddBudgetAndTechnicalDetailsDTO,
    CreateApplicationRepoDTO,
} from "../../../driving/dtos/applicant.dto";
import {ProjectBasicInfo} from "../../../../core/domain/value-objects/project.basicinfo.object";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {GrantApplicationStatus} from "../../../../core/domain/constants/status.constants";
import {Money} from "../../../../core/domain/value-objects/project.metrics.object";
import {TechnicalSpec} from "../../../../core/domain/value-objects/project.technicalspec";
import {MarketInfo} from "../../../../core/domain/value-objects/marketinfo.object";
import {
    RevenueModel,
    RevenueStream,
} from "../../../../core/domain/value-objects/revenue.info.object";
import {Risk} from "../../../../core/domain/value-objects/risk.object";
import {ProjectMilestone} from "../../../../core/domain/value-objects/project.status.object";
import {User} from "../../../../core/domain/aggregates/user.aggregate";

@Injectable()
/**
 * This file contains the repository functions for the grant application aggregate
 * Save , Step Wise Save , Delete and Fetch
 */
export class GrantApplicationRepository
    implements GrantApplicationAggregatePort
{
    constructor(
        @InjectRepository(GrantApplication)
        private readonly grantApplicationRepository: Repository<GrantApplication>
    ) {}

    async save(
        applicationData: CreateApplicationRepoDTO
    ): Promise<GrantApplication> {
        try {
            const {userId, cycleId, basicInfo} = applicationData;
            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);
            const basicInfoObject = new ProjectBasicInfo(
                basicInfo.title,
                basicInfo.summary,
                basicInfo.problem,
                basicInfo.solution,
                basicInfo.innovation
            );

            const application = this.grantApplicationRepository.create({
                applicantId: userId,
                cycleId: cycleId,
                basicDetails: basicInfoObject,
                slug,
                status: GrantApplicationStatus.DRAFT,
            });

            await this.grantApplicationRepository.save(application);

            return application;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to create application",
                "Database Error"
            );
        }
    }

    async addApplicationBudgetDetails(
        application: GrantApplication,
        budgetDetails: AddBudgetAndTechnicalDetailsDTO
    ): Promise<GrantApplication> {
        try {
            const {budget, technicalSpec, marketInfo} = budgetDetails;

            const ApplicationBudget = new Money(budget.amount, budget.currency);

            const ApplicationTechnicalSpec = new TechnicalSpec(
                technicalSpec.description,
                technicalSpec.techStack,
                technicalSpec.prototype
            );

            const ApplicationMarketInfo = new MarketInfo(
                marketInfo.totalAddressableMarket,
                marketInfo.serviceableMarket,
                marketInfo.obtainableMarket,
                marketInfo.competitorAnalysis
            );

            application.budget = ApplicationBudget;
            application.technicalSpec = ApplicationTechnicalSpec;
            application.marketInfo = ApplicationMarketInfo;

            const savedApplication =
                await this.grantApplicationRepository.save(application);

            return savedApplication;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to add budget details of  application",
                "Database Error"
            );
        }
    }

    async addApplicationRevenueStream(
        application: GrantApplication,
        revenueDetails: AddApplicationRevenueStreamDTO
    ): Promise<GrantApplication> {
        try {
            const {revenueModel} = revenueDetails;
            const {primaryStream, secondaryStreams, pricing, unitEconomics} =
                revenueModel;
            const primaryRevenue = new RevenueStream(
                primaryStream.type,
                primaryStream.description,
                primaryStream.percentage
            );
            // eslint-disable-next-line
            const secondaryRevenues = secondaryStreams.map(
                (revenue) =>
                    new RevenueStream(
                        revenue.type,
                        revenue.description,
                        revenue.percentage
                    )
            );

            const ApplicationRevenueStream = new RevenueModel(
                primaryRevenue,
                secondaryRevenues,
                pricing,
                unitEconomics
            );

            application.revenueInfo = ApplicationRevenueStream;
            const savedApplication =
                await this.grantApplicationRepository.save(application);

            return savedApplication;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to add revenue details of  application",
                "Database Error"
            );
        }
    }

    async addApplicationRisksAndMileStones(
        application: GrantApplication,
        risksAndMileStoneDetails: AddApplicationRisksAndMilestonesDTO
    ): Promise<GrantApplication> {
        try {
            const {risks, milestones} = risksAndMileStoneDetails;

            // eslint-disable-next-line
            const ApplicationRisks = risks.map(
                (risk) =>
                    new Risk(risk.description, risk.impact, risk.mitigation)
            );

            // eslint-disable-next-line
            const ApplicationMileStones = milestones.map(
                (milestone) =>
                    new ProjectMilestone(
                        milestone.title,
                        milestone.description,
                        milestone.deliverables,
                        milestone.dueDate
                    )
            );

            application.risks = ApplicationRisks;
            application.milestones = ApplicationMileStones;

            const savedApplication =
                await this.grantApplicationRepository.save(application);

            return savedApplication;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to add risks and milestone details of  application",
                "Database Error"
            );
        }
    }

    async addApplicationTeammates(
        application: GrantApplication,
        teamMateDetails: User[]
    ): Promise<GrantApplication> {
        try {
            if (application.teammates) {
                teamMateDetails.map((user) => {
                    application.teammates.push(user);
                });
            } else {
                application.teammates = teamMateDetails;
            }

            const savedApplication =
                await this.grantApplicationRepository.save(application);

            return savedApplication;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to add teammate  details of  application",
                "Database Error"
            );
        }
    }
    async findById(id: string): Promise<GrantApplication | null> {
        try {
            const grantApplication =
                await this.grantApplicationRepository.findOne({
                    where: {id},
                });

            return grantApplication;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch application",
                "Database Error"
            );
        }
    }

    async findBySlug(slug: string): Promise<GrantApplication | null> {
        try {
            const grantApplication =
                await this.grantApplicationRepository.findOne({
                    where: {slug},
                });

            return grantApplication;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch application",
                "Database Error"
            );
        }
    }

    async deleteApplication(
        oldApplication: GrantApplication
    ): Promise<GrantApplication> {
        try {
            oldApplication.status = GrantApplicationStatus.DELETED;

            return await this.grantApplicationRepository.save(oldApplication);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to delete application",
                "Database Error"
            );
        }
    }

    async findUserCycleApplication(
        userId: string,
        cycleId: string
    ): Promise<GrantApplication | null> {
        try {
            const application = await this.grantApplicationRepository.findOne({
                where: {
                    applicantId: userId,
                    cycleId,
                },
                order: {
                    createdAt: "DESC",
                },
            });

            return application;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch application",
                "Database Error"
            );
        }
    }

    async getUserApplications(userId: string): Promise<GrantApplication[]> {
        try {
            const grantApplications =
                await this.grantApplicationRepository.find({
                    where: {
                        applicantId: userId,
                    },
                });

            return grantApplications;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch user applications",
                "Database Error"
            );
        }
    }
}
