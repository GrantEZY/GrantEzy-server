import {Review} from "../../../../core/domain/aggregates/application.review.aggregate";
import {ReviewStatus} from "../../../../core/domain/constants/status.constants";
import {UpdateReviewDTO} from "../../../../infrastructure/driving/dtos/reviewer.dto";
export interface ReviewerAggregatePort {
    addReviewerToApplication(
        userId: string,
        applicationId: string
    ): Promise<Review>;

    getUserApplicationReview(
        userId: string,
        applicationId: string
    ): Promise<Review | null>;

    modifyReview(
        review: Review,
        updateDetails: UpdateReviewDTO
    ): Promise<Review>;

    changeReviewStatus(review: Review, status: ReviewStatus): Promise<Review>;

    findBySlug(reviewSlug: string): Promise<Review | null>;

    getApplicationReviews(
        applicationId: string,
        page: number,
        numberOfResults: number
    ): Promise<Review[]>;

    getUserReviews(
        userId: string,
        page: number,
        numberOfResults: number
    ): Promise<Review[]>;

    getReviewById(reviewId: string): Promise<Review | null>;
}

export const REVIEW_AGGREGATE_PORT = Symbol("ReviewerAggregatePort");
