import {ProjectReviewAggregate} from "../../../../core/domain/aggregates/project.review.aggregate";
import {ReviewStatus} from "../../../../core/domain/constants/status.constants";
import {ProjectReviewSubmissionDTO} from "../../../../infrastructure/driving/dtos/reviewer.dto";

export interface ProjectReviewAggregatePort {
    addReviewerToProject(
        userId: string,
        assessmentId: string
    ): Promise<ProjectReviewAggregate>;
    modifyReview(
        review: ProjectReviewAggregate,
        updateDetails: ProjectReviewSubmissionDTO
    ): Promise<ProjectReviewAggregate>;

    changeReviewStatus(
        review: ProjectReviewAggregate,
        status: ReviewStatus
    ): Promise<ProjectReviewAggregate>;

    findBySlug(reviewSlug: string): Promise<ProjectReviewAggregate | null>;

    findAssessmentReviewerByUserIdAndAssessmentId(
        userId: string,
        assessmentId: string
    ): Promise<ProjectReviewAggregate | null>;

    getUserReviews(
        userId: string,
        page: number,
        numberOfResults: number
    ): Promise<ProjectReviewAggregate[]>;

    getUserReviewByAssessmentSlugAndUserId(
        assessmentSlug: string,
        userId: string
    ): Promise<ProjectReviewAggregate | null>;
}
export const PROJECT_REVIEW_AGGREGATE_PORT = Symbol(
    "ProjectReviewAggregatePort"
);
