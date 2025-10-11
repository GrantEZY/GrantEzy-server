import {Review} from "../../../../core/domain/aggregates/review.aggregate";

export interface ReviewerAggregatePort {
    addReviewerToApplication(
        userId: string,
        applicationId: string
    ): Promise<Review>;

    getUserApplicationReview(
        userId: string,
        applicationId: string
    ): Promise<Review | null>;

    getReviewById(reviewId: string): Promise<Review | null>;
}

export const REVIEW_AGGREGATE_PORT = Symbol("ReviewerAggregatePort");
