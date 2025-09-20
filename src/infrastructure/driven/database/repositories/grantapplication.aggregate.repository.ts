import {GrantApplicationAggregatePort} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {Injectable} from "@nestjs/common";
import {GrantApplication} from "../../../../core/domain/aggregates/grantapplication.aggregate";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {CreateApplicationRepoDTO} from "../../../driving/dtos/applicant.dto";
import {ProjectBasicInfo} from "../../../../core/domain/value-objects/project.basicinfo.object";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {GrantApplicationStatus} from "../../../../core/domain/constants/status.constants";

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
