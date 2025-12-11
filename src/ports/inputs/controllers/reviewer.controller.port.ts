import {
    GetTokenDetailsDTO,
    SubmitInviteStatusDTO,
} from "../../../infrastructure/driving/dtos/co.applicant.dto";
import {Response} from "express";
import {
    GetReviewDetailsDTO,
    GetUserReviewsDTO,
    SubmitReviewDTO,
    SubmitProjectAssessmentReviewInviteStatusDTO,
    GetProjectReviewDetailsDTO,
    ProjectReviewSubmissionDTO,
} from "../../../infrastructure/driving/dtos/reviewer.dto";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
export interface ReviewerControllerPort {
    getTokenDetails(
        parameter: GetTokenDetailsDTO,
        response: Response
    ): Promise<Response>;

    updateInviteStatus(
        body: SubmitInviteStatusDTO,
        response: Response
    ): Promise<Response>;

    submitApplicationReview(
        body: SubmitReviewDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    submitProjectAssessmentReview(
        body: ProjectReviewSubmissionDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getUserReviews(
        parameters: GetUserReviewsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getUserProjectReviews(
        parameters: GetUserReviewsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getReviewDetails(
        parameters: GetReviewDetailsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getProjectReviewDetails(
        parameters: GetProjectReviewDetailsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    submitReviewerInviteStatus(
        body: SubmitProjectAssessmentReviewInviteStatusDTO,
        response: Response
    ): Promise<Response>;

    handleError(error: unknown, response: Response): Response;
}
