import {ReviewerAggregatePort} from "../../../../ports/outputs/repository/review/review.aggregate.port";
import {Review} from "../../../../core/domain/aggregates/review.aggregate";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {ReviewStatus} from "../../../../core/domain/constants/status.constants";
import {UpdateReviewDTO} from "../../../driving/dtos/reviewer.dto";
import {ScoreBuilder} from "../../../../core/domain/value-objects/review.scores.object";
import {MoneyBuilder} from "../../../../core/domain/value-objects/project.metrics.object";
@Injectable()
export class ReviewAggregateRepository implements ReviewerAggregatePort {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) {}

    async addReviewerToApplication(
        userId: string,
        applicationId: string
    ): Promise<Review> {
        try {
            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);

            const newReview = this.reviewRepository.create({
                reviewerId: userId,
                applicationId: applicationId,
                status: ReviewStatus.IN_PROGRESS,
                slug,
            });
            return await this.reviewRepository.save(newReview);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to add reviewer to application",
                "Database"
            );
        }
    }

    async getReviewById(reviewId: string): Promise<Review | null> {
        try {
            return await this.reviewRepository.findOne({where: {id: reviewId}});
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to get review by ID", "Database");
        }
    }

    getUserApplicationReview(
        userId: string,
        applicationId: string
    ): Promise<Review | null> {
        try {
            return this.reviewRepository.findOne({
                where: {reviewerId: userId, applicationId: applicationId},
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to get user application review",
                "Database"
            );
        }
    }

    async modifyReview(
        review: Review,
        updateDetails: UpdateReviewDTO
    ): Promise<Review> {
        try {
            const {scores, recommendation, budget} = updateDetails;

            if (scores) {
                const reviewScores = ScoreBuilder(scores);
                review.scores = reviewScores;
            }

            if (recommendation) {
                review.recommendation = recommendation;
            }

            if (budget) {
                const reviewBudget = MoneyBuilder(budget);
                review.suggestedBudget = reviewBudget;
            }

            const updatedReview = await this.reviewRepository.save(review);

            return updatedReview;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to modify review", "Database");
        }
    }

    async changeReviewStatus(
        review: Review,
        status: ReviewStatus
    ): Promise<Review> {
        try {
            review.status = status;
            return await this.reviewRepository.save(review);
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

    async getApplicationReviews(
        applicationId: string,
        page: number,
        numberOfResults: number
    ): Promise<Review[]> {
        try {
            const reviews = await this.reviewRepository.find({
                where: {applicationId},
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
                "Failed to get application reviews",
                "Database"
            );
        }
    }

    async getUserReviews(
        userId: string,
        page: number,
        numberOfResults: number
    ): Promise<Review[]> {
        try {
            const reviews = await this.reviewRepository.find({
                where: {
                    reviewerId: userId,
                },
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
                "Failed to get user application reviews",
                "Database"
            );
        }
    }

    async findBySlug(reviewSlug: string): Promise<Review | null> {
        try {
            const review = await this.reviewRepository.findOne({
                where: {slug: reviewSlug},
                relations: ["application"],
            });

            return review;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to get application review details",
                "Database"
            );
        }
    }
}
