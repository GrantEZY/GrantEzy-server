import {InviteStatus} from "../../../core/domain/constants/invite.constants";
import {ReviewStatus} from "../../../core/domain/constants/status.constants";
import {ApiResponse} from "../../../shared/types/response.type";
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

export class UpdateReviewInviteResponse extends ApiResponse(
    UpdateReviewInvite
) {}
export class SubmitReviewResponse extends ApiResponse(SubmitReviewDetails) {}
