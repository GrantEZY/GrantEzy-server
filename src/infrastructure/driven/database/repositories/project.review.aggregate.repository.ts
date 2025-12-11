import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {ProjectReviewAggregate} from "../../../../core/domain/aggregates/project.review.aggregate";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {v4 as uuid} from "uuid";
import {ProjectReviewAggregatePort} from "../../../../ports/outputs/repository/projectReview/project.review.aggregate.port";
import {ReviewStatus} from "../../../../core/domain/constants/status.constants";
import {ProjectReviewSubmissionDTO} from "../../../driving/dtos/reviewer.dto";

@Injectable()
export class ProjectReviewAggregateRepository
    implements ProjectReviewAggregatePort
{
    constructor(
        @InjectRepository(ProjectReviewAggregate)
        private readonly projectReviewRepository: Repository<ProjectReviewAggregate>
    ) {}

    async getUserReviews(
        userId: string,
        page: number,
        numberOfResults: number
    ): Promise<ProjectReviewAggregate[]> {
        try {
            const reviews = await this.projectReviewRepository.find({
                where: {reviewerId: userId},
                relations: [
                    "reviewSubmission",
                    "reviewSubmission.project",
                    "reviewSubmission.criteria",
                ],
                skip: (page - 1) * numberOfResults,
                take: numberOfResults,
            });
            return reviews;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to get user project reviews",
                "Database"
            );
        }
    }

    async findBySlug(
        reviewSlug: string
    ): Promise<ProjectReviewAggregate | null> {
        try {
            return await this.projectReviewRepository.findOne({
                where: {slug: reviewSlug},
                relations: [
                    "reviewSubmission",
                    "reviewSubmission.project",
                    "reviewSubmission.criteria",
                ],
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to find review by slug",
                "Database"
            );
        }
    }

    async changeReviewStatus(
        review: ProjectReviewAggregate,
        status: ReviewStatus
    ): Promise<ProjectReviewAggregate> {
        try {
            review.status = status;
            return await this.projectReviewRepository.save(review);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to change review status",
                "Database"
            );
        }
    }

    async modifyReview(
        review: ProjectReviewAggregate,
        updateDetails: ProjectReviewSubmissionDTO
    ): Promise<ProjectReviewAggregate> {
        try {
            review.recommendation = updateDetails.recommendation;
            review.reviewAnalysis = updateDetails.reviewAnalysis;
            const updatedReview =
                await this.projectReviewRepository.save(review);
            return updatedReview;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to modify review", "Database");
        }
    }

    async addReviewerToProject(
        userId: string,
        assessmentId: string
    ): Promise<ProjectReviewAggregate> {
        try {
            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);

            const newReview = this.projectReviewRepository.create({
                reviewerId: userId,
                submissionId: assessmentId,
                status: ReviewStatus.IN_PROGRESS,
                slug,
            });
            return await this.projectReviewRepository.save(newReview);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to add reviewer to project",
                "Database"
            );
        }
    }
}
