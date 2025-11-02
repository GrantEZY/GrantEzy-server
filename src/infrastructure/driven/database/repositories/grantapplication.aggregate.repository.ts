import {GrantApplicationAggregatePort} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {Injectable} from "@nestjs/common";
import {GrantApplication} from "../../../../core/domain/aggregates/grantapplication.aggregate";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {
    AddApplicationRevenueStreamDTO,
    AddApplicationRisksAndMilestonesDTO,
    AddApplicationTechnicalAndMarketInfoDTO,
    AddBudgetDetailsDTO,
    ApplicationDocumentsDTO,
    CreateApplicationRepoDTO,
} from "../../../driving/dtos/applicant.dto";
import {ProjectBasicInfoObjectBuilder} from "../../../../core/domain/value-objects/project.basicinfo.object";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {GrantApplicationStatus} from "../../../../core/domain/constants/status.constants";
import {TechnicalSpecObjectBuilder} from "../../../../core/domain/value-objects/project.technicalspec";
import {MarketInfoObjectBuilder} from "../../../../core/domain/value-objects/marketinfo.object";
import {ApplicationRevenueModelObjectBuilder} from "../../../../core/domain/value-objects/revenue.info.object";
import {ApplicationRiskObjectBuilder} from "../../../../core/domain/value-objects/risk.object";
import {ApplicationMileStoneObjectBuilder} from "../../../../core/domain/value-objects/project.status.object";
import {User} from "../../../../core/domain/aggregates/user.aggregate";
import {QuotedBudgetObjectBuilder} from "../../../../core/domain/value-objects/quotedbudget.object";
import {ApplicationDocumentObjectBuilder} from "../../../../core/domain/value-objects/applicationdocuments.object";

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

    /**
     *
     * @param applicationData contains the initial data for the application
     * @returns returns successfully savedApplication
     */
    async save(
        applicationData: CreateApplicationRepoDTO
    ): Promise<GrantApplication> {
        try {
            const {userId, cycleId, basicInfo} = applicationData;
            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);

            const basicInfoObject = ProjectBasicInfoObjectBuilder(basicInfo);

            const application = this.grantApplicationRepository.create({
                applicantId: userId,
                cycleId: cycleId,
                basicDetails: basicInfoObject,
                slug,
                stepNumber: 1,
                status: GrantApplicationStatus.DRAFT,
            });

            const savedApplication =
                await this.grantApplicationRepository.save(application);

            return savedApplication;
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

    /**
     *
     * @param application application Data
     * @param budgetDetails budgetDetails for the application
     * @returns savedApplication
     */

    async addApplicationBudgetDetails(
        application: GrantApplication,
        budgetDetails: AddBudgetDetailsDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication> {
        try {
            const {budget} = budgetDetails;

            const quotedBudget = QuotedBudgetObjectBuilder(budget);
            if (stepUpdate) {
                application.stepNumber++;
            }
            application.budget = quotedBudget;

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

    /**
     *
     * @param application application Data
     * @param technicalAndMarketInfo technical And  Market Info of the application
     * @returns saved Application
     */

    async addApplicationTechnicalAndMarketInfo(
        application: GrantApplication,
        technicalAndMarketInfo: AddApplicationTechnicalAndMarketInfoDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication> {
        try {
            const {technicalSpec, marketInfo} = technicalAndMarketInfo;

            const applicationTechnicalSpec =
                TechnicalSpecObjectBuilder(technicalSpec);

            const applicationMarketInfo = MarketInfoObjectBuilder(marketInfo);

            if (stepUpdate) {
                application.stepNumber++;
            }
            application.marketInfo = applicationMarketInfo;
            application.technicalSpec = applicationTechnicalSpec;

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

    /**
     *
     * @param application Application Data
     * @param revenueDetails revenue Details of the application
     * @returns savedApplication
     */

    async addApplicationRevenueStream(
        application: GrantApplication,
        revenueDetails: AddApplicationRevenueStreamDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication> {
        try {
            const {revenueModel} = revenueDetails;

            const ApplicationRevenueStream =
                ApplicationRevenueModelObjectBuilder(revenueModel);

            if (stepUpdate) {
                application.stepNumber++;
            }
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

    /**
     *
     * @param application Application  Data
     * @param risksAndMileStoneDetails risks and Milestones Data
     * @returns savedApplication
     */
    async addApplicationRisksAndMileStones(
        application: GrantApplication,
        risksAndMileStoneDetails: AddApplicationRisksAndMilestonesDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication> {
        try {
            const {risks, milestones} = risksAndMileStoneDetails;

            const ApplicationRisks = ApplicationRiskObjectBuilder(risks);

            if (stepUpdate) {
                application.stepNumber++;
            }
            const ApplicationMileStones =
                ApplicationMileStoneObjectBuilder(milestones);
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

    /**
     *
     * @param application application Data
     * @param documentDetail document Details of the application
     * @returns savedApplication
     */

    async addApplicationDocuments(
        application: GrantApplication,
        documentDetail: ApplicationDocumentsDTO,
        stepUpdate: boolean
    ): Promise<GrantApplication> {
        try {
            const applicationDocumentDetails =
                ApplicationDocumentObjectBuilder(documentDetail);

            application.applicationDocuments = applicationDocumentDetails;

            if (stepUpdate) {
                application.stepNumber++;
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
                "Failed to add document  details of  application",
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

    async modifyApplicationStatus(
        application: GrantApplication,
        status: GrantApplicationStatus,
        stepUpdate: boolean
    ): Promise<GrantApplication> {
        try {
            application.status = status;
            if (stepUpdate) {
                application.stepNumber++;
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
                "Failed to modify status  of  application",
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
                relations: ["teamMateInvites", "cycle"],
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

    async getUserCreatedApplication(
        applicationId: string
    ): Promise<GrantApplication | null> {
        try {
            const application = await this.grantApplicationRepository.findOne({
                where: {
                    id: applicationId,
                },
                relations: [
                    "teamMateInvites",
                    "cycle",
                    "teammates",
                    "cycle.program",
                    "applicant",
                ],
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

    async getUserCreatedApplicationWithSlug(
        applicationSlug: string
    ): Promise<GrantApplication | null> {
        try {
            const application = await this.grantApplicationRepository.findOne({
                where: {
                    slug: applicationSlug,
                },
                relations: [
                    "teamMateInvites",
                    "cycle",
                    "teammates",
                    "cycle.program",
                ],
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

    async getUserApplicationBasedOnStatus(
        status: GrantApplicationStatus,
        cycleId: string,
        page: number,
        numberOfResults: number
    ): Promise<GrantApplication[]> {
        try {
            const applications = await this.grantApplicationRepository.find({
                where: {
                    cycleId,
                    status,
                },
                skip: (page - 1) * numberOfResults,
                take: numberOfResults,
            });

            return applications;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch applications based on status",
                "Database Error"
            );
        }
    }

    async getApplicationDetailsWithProject(
        applicationId: string
    ): Promise<GrantApplication | null> {
        try {
            const application = await this.grantApplicationRepository.findOne({
                where: {id: applicationId},
                relations: ["project", "cycle"],
            });

            return application;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch applications with project",
                "Database Error"
            );
        }
    }
}
