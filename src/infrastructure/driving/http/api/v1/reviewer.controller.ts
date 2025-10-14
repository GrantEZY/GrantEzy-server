import {Body, Controller, Get, Post, Query, Res} from "@nestjs/common";
import {ReviewerService} from "../../../../../core/domain/services/reviewer/reviewer.service";
import {ApiTags} from "@nestjs/swagger";
import ApiError from "../../../../../shared/errors/api.error";
import {Response} from "express";
import {ReviewerControllerPort} from "../../../../../ports/inputs/controllers/reviewer.controller.port";
import {
    GetTokenDetailsDTO,
    SubmitInviteStatusDTO,
} from "../../../dtos/co.applicant.dto";
import {REVIEWER_RESPONSES} from "../../../../../config/swagger/docs/reviewer.swagger";
import {ApiResponse} from "@nestjs/swagger";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import {SubmitReviewDTO} from "../../../dtos/reviewer.dto";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {
    GetUserReviewsDTO,
    GetReviewDetailsDTO,
} from "../../../dtos/reviewer.dto";
@Controller("reviewer")
@ApiTags("Reviewer")
export class ReviewerController implements ReviewerControllerPort {
    constructor(private readonly reviewService: ReviewerService) {}

    @Get("/get-token-details")
    @ApiResponse(REVIEWER_RESPONSES.GET_TOKEN_DETAILS.SUCCESS)
    @ApiResponse(REVIEWER_RESPONSES.GET_TOKEN_DETAILS.APPLICATION_NOT_FOUND)
    @ApiResponse(REVIEWER_RESPONSES.GET_TOKEN_DETAILS.INVITE_CONFLICT)
    @ApiResponse(REVIEWER_RESPONSES.GET_TOKEN_DETAILS.TOKEN_INVALID)
    @ApiResponse(REVIEWER_RESPONSES.GET_TOKEN_DETAILS.INVITE_EXPIRED)
    async getTokenDetails(
        @Query() parameter: GetTokenDetailsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.reviewService.getTokenDetails(
                parameter.token
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/update-invite-status")
    @ApiResponse(REVIEWER_RESPONSES.UPDATE_REVIEW_INVITE.SUCCESS_ACCEPTED)
    @ApiResponse(REVIEWER_RESPONSES.UPDATE_REVIEW_INVITE.SUCCESS_REJECTED)
    @ApiResponse(REVIEWER_RESPONSES.UPDATE_REVIEW_INVITE.USER_NOT_FOUND)
    @ApiResponse(REVIEWER_RESPONSES.UPDATE_REVIEW_INVITE.CONFLICT_ERROR)
    @ApiResponse(REVIEWER_RESPONSES.UPDATE_REVIEW_INVITE.ALREADY_REVIEWER)
    async updateInviteStatus(
        @Body() body: SubmitInviteStatusDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.reviewService.updateInviteStatus(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/submit-application-review")
    @ApiResponse(REVIEWER_RESPONSES.SUBMIT_REVIEW.SUCCESS)
    @ApiResponse(REVIEWER_RESPONSES.SUBMIT_REVIEW.REVIEW_ALREADY_COMPLETED)
    @ApiResponse(REVIEWER_RESPONSES.SUBMIT_REVIEW.REVIEW_NOT_FOUND)
    async submitApplicationReview(
        @Body() body: SubmitReviewDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.reviewService.submitReview(body, id);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-user-reviews")
    @ApiResponse(REVIEWER_RESPONSES.GET_USER_REVIEWS.SUCCESS)
    async getUserReviews(
        @Query() parameters: GetUserReviewsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.reviewService.getUserReviews(
                parameters,
                id
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-review-details")
    @ApiResponse(REVIEWER_RESPONSES.GET_REVIEW_DETAILS.SUCCESS)
    @ApiResponse(REVIEWER_RESPONSES.GET_REVIEW_DETAILS.REVIEW_NOT_FOUND)
    @ApiResponse(REVIEWER_RESPONSES.GET_REVIEW_DETAILS.REVIEW_NOT_FOUND)
    async getReviewDetails(
        @Query() parameters: GetReviewDetailsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.reviewService.getReviewDetails(
                parameters,
                id
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    handleError(error: unknown, response: Response) {
        if (error instanceof ApiError) {
            return response.status(error.status).json({
                status: error.status,
                message: error.message,
                res: null,
            });
        }

        if (typeof error === "object" && error !== null && "status" in error) {
            const event = error as {status?: number; message?: string};
            return response.status(event.status ?? 500).json({
                status: event.status ?? 500,
                message: event.message ?? "Internal Server Error",
                res: null,
            });
        }

        return response.status(500).json({
            status: 500,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
            res: null,
        });
    }
}
