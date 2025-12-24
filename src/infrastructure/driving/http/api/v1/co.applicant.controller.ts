import {Body, Controller, Get, Query, Res, Patch, Delete} from "@nestjs/common";
import {ApiTags, ApiResponse} from "@nestjs/swagger";
import {CoApplicantService} from "../../../../../core/domain/services/co-applicant/co.applicant.service";
import {CoApplicantControllerPort} from "../../../../../ports/inputs/controllers/co.applicant.controller.port";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {Public} from "../../../../../shared/decorators/public.decorator";
import {
    CoApplicantApplicationDTO,
    GetProjectDetailsDTO,
    GetTokenDetailsDTO,
    SubmitInviteStatusDTO,
    GetUserLinkedProjectsPaginationDTO,
    ManageCoApplicantDTO,
} from "../../../dtos/co.applicant.dto";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import ApiError from "../../../../../shared/errors/api.error";
import {Response} from "express";
import {
    CO_APPLICANT_PROJECT_RESPONSES,
    CO_APPLICANT_RESPONSES,
} from "../../../../../config/swagger/docs/co.applicant.swagger";
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

    @Public()
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
                parameter.token,
                parameter.slug
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Public()
    @Patch("/update-user-invite-status")
    @ApiResponse(CO_APPLICANT_RESPONSES.UPDATE_INVITE_STATUS.SUCCESS_ACCEPTED)
    @ApiResponse(
        CO_APPLICANT_RESPONSES.UPDATE_INVITE_STATUS.APPLICATION_UPDATE_FAILED
    )
    @ApiResponse(CO_APPLICANT_RESPONSES.UPDATE_INVITE_STATUS.UPDATE_FAILED)
    @ApiResponse(CO_APPLICANT_RESPONSES.UPDATE_INVITE_STATUS.USER_NOT_FOUND)
    async updateUserInviteStatus(
        @Body() inviteStatusData: SubmitInviteStatusDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result =
                await this.coApplicantService.updateTeamMateInviteStatus(
                    inviteStatusData
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-user-linked-projects")
    @ApiResponse(
        CO_APPLICANT_PROJECT_RESPONSES.GET_USER_LINKED_PROJECTS.SUCCESS
    )
    async getUserLinkedProjects(
        @Query() parameters: GetUserLinkedProjectsPaginationDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.coApplicantService.getUserLinkedProjects(
                id,
                parameters.page,
                parameters.numberOfResults
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-project-details")
    @ApiResponse(CO_APPLICANT_PROJECT_RESPONSES.GET_PROJECT_DETAILS.SUCCESS)
    @ApiResponse(CO_APPLICANT_PROJECT_RESPONSES.GET_PROJECT_DETAILS.FORBIDDEN)
    @ApiResponse(
        CO_APPLICANT_PROJECT_RESPONSES.GET_PROJECT_DETAILS.APPLICATION_NOT_FOUND
    )
    @ApiResponse(
        CO_APPLICANT_PROJECT_RESPONSES.GET_PROJECT_DETAILS.NOT_A_PROJECT
    )
    async getProjectDetails(
        @Query() parameters: GetProjectDetailsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.coApplicantService.getProjectDetails(
                parameters.applicationSlug,
                id
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Delete("/remove-co-applicant-from-application")
    @ApiResponse(CO_APPLICANT_RESPONSES.REMOVE_SELF_FROM_APPLICATION.SUCCESS)
    @ApiResponse(
        CO_APPLICANT_RESPONSES.REMOVE_SELF_FROM_APPLICATION.USER_NOT_FOUND
    )
    @ApiResponse(
        CO_APPLICANT_RESPONSES.REMOVE_SELF_FROM_APPLICATION.NOT_A_TEAMMATE
    )
    @ApiResponse(
        CO_APPLICANT_RESPONSES.REMOVE_SELF_FROM_APPLICATION.APPLICANT_NOT_FOUND
    )
    @ApiResponse(
        CO_APPLICANT_RESPONSES.REMOVE_SELF_FROM_APPLICATION.REMOVE_FAILED
    )
    @ApiResponse(
        CO_APPLICANT_RESPONSES.REMOVE_SELF_FROM_APPLICATION.EMAIL_FAILED
    )
    @ApiResponse(CO_APPLICANT_RESPONSES.REMOVE_SELF_FROM_APPLICATION.ERROR)
    async removeCoApplicantFromApplication(
        @Body() body: ManageCoApplicantDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.coApplicantService.removeCoApplicantFromApplication(
                    body,
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
