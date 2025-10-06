import {Controller, Get, Query, Res} from "@nestjs/common";
import {ApiTags, ApiResponse} from "@nestjs/swagger";
import {CoApplicantService} from "../../../../../core/domain/services/co-applicant/co.applicant.service";
import {CoApplicantControllerPort} from "../../../../../ports/inputs/controllers/co.applicant.controller.port";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {
    CoApplicantApplicationDTO,
    GetTokenDetailsDTO,
} from "../../../dtos/co.applicant.dto";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import ApiError from "../../../../../shared/errors/api.error";
import {Response} from "express";
import {CO_APPLICANT_RESPONSES} from "../../../../../config/swagger/docs/co.applicant.swagger";
@ApiTags("Co-Applicants")
@Controller("co-applicant")
export class CoApplicantController implements CoApplicantControllerPort {
    constructor(private readonly coApplicantService: CoApplicantService) {}

    @Get("/get-application-details")
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_APPLICATION_DETAILS.SUCCESS)
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_APPLICATION_DETAILS.NOT_FOUND)
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_APPLICATION_DETAILS.FORBIDDEN)
    async getApplicationDetails(
        @Query() parameter: CoApplicantApplicationDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.coApplicantService.getApplicationDetails(
                parameter.applicationId,
                id
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-token-details")
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_TOKEN_DETAILS.SUCCESS)
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_TOKEN_DETAILS.APPLICATION_NOT_FOUND)
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_TOKEN_DETAILS.INVITE_CONFLICT)
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_TOKEN_DETAILS.TOKEN_INVALID)
    @ApiResponse(CO_APPLICANT_RESPONSES.GET_TOKEN_DETAILS.INVITE_EXPIRED)
    async getTokenDetails(
        @Query() parameter: GetTokenDetailsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.coApplicantService.getTokenDetails(
                parameter.token
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
