import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {ApplicationReviewAggregate} from "../../../core/domain/aggregates/application.review.aggregate";
import {InviteStatus} from "../../../core/domain/constants/invite.constants";
import {ReviewStatus} from "../../../core/domain/constants/status.constants";
import {ApiResponse} from "../../../shared/types/response.type";
import {ProjectReviewAggregate} from "../../../core/domain/aggregates/project.review.aggregate";
import {CycleAssessmentAggregate} from "../../../core/domain/aggregates/cycle.assessment.aggregate";
import {Project} from "../../../core/domain/aggregates/project.aggregate";
import {CycleAssessmentCriteriaAggregate} from "../../../core/domain/aggregates/cycle.assessment.criteria.aggregate";
export class UpdateReviewInvite {
    applicationId: string;
    status: InviteStatus;
    reviewId: string | null;
}

export class SubmitReviewDetails {
    applicationId: string;
    reviewId: string;
    status: ReviewStatus;
}

export class SubmitProjectReviewDetails {
    submissionId: string;
    reviewId: string;
    status: ReviewStatus;
}

export class GetUserReviews {
    reviews: ApplicationReviewAggregate[];
}

export class GetUserProjectReviews {
    reviews: ProjectReviewAggregate[];
}
export class GetReviewDetails {
    review: ApplicationReviewAggregate;
    application: GrantApplication;
}

export class GetProjectReviewDetails {
    review: ProjectReviewAggregate;
    assessment: CycleAssessmentAggregate;
    project: Project;
    criteria: CycleAssessmentCriteriaAggregate;
}
export class UpdateReviewInviteResponse extends ApiResponse(
    UpdateReviewInvite
) {}
export class SubmitReviewResponse extends ApiResponse(SubmitReviewDetails) {}
export class GetUserReviewsResponse extends ApiResponse(GetUserReviews) {}
export class GetReviewDetailsResponse extends ApiResponse(GetReviewDetails) {}
export class GetUserProjectReviewsResponse extends ApiResponse(
    GetUserProjectReviews
) {}
export class GetProjectReviewDetailsResponse extends ApiResponse(
    GetProjectReviewDetails
) {}
export class SubmitProjectAssessmentReviewResponse extends ApiResponse(
    SubmitProjectReviewDetails
) {}
