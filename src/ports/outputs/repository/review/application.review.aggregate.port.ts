import {ApplicationReviewAggregate} from "../../../../core/domain/aggregates/application.review.aggregate";
import {ReviewStatus} from "../../../../core/domain/constants/status.constants";
import {UpdateReviewDTO} from "../../../../infrastructure/driving/dtos/reviewer.dto";
export interface ReviewerAggregatePort {
    addReviewerToApplication(
        userId: string,
        applicationId: string
    ): Promise<ApplicationReviewAggregate>;

    getUserApplicationReview(
        userId: string,
        applicationId: string
    ): Promise<ApplicationReviewAggregate | null>;

    modifyReview(
        review: ApplicationReviewAggregate,
        updateDetails: UpdateReviewDTO
    ): Promise<ApplicationReviewAggregate>;

    changeReviewStatus(
        review: ApplicationReviewAggregate,
        status: ReviewStatus
    ): Promise<ApplicationReviewAggregate>;

    findBySlug(reviewSlug: string): Promise<ApplicationReviewAggregate | null>;

    getApplicationReviews(
        applicationId: string,
        page: number,
        numberOfResults: number
    ): Promise<ApplicationReviewAggregate[]>;

    getUserReviews(
        userId: string,
        page: number,
        numberOfResults: number
    ): Promise<ApplicationReviewAggregate[]>;

    getReviewById(reviewId: string): Promise<ApplicationReviewAggregate | null>;
}

export const REVIEW_AGGREGATE_PORT = Symbol("ReviewerAggregatePort");
