import {Body, Controller, Post, Res, Get} from "@nestjs/common";
import {Response} from "express";
import ApiError from "../../../../../shared/errors/api.error";
import {ApplicantControllerPort} from "../../../../../ports/inputs/controllers/applicant.controller.port";
import {ApplicantService} from "../../../../../core/domain/services/applicant/applicant.service";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import {CreateApplicationControllerDTO} from "../../../dtos/applicant.dto";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {APPLICATION_RESPONSES} from "../../../../../config/swagger/docs/applicant.swagger";
@ApiTags("Applicants")
@Controller("applicant")
export class ApplicantController implements ApplicantControllerPort {
    constructor(private readonly applicantService: ApplicantService) {}

    @Post("/create-application")
    @ApiResponse(APPLICATION_RESPONSES.CREATE.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.CREATE.CYCLE_NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.CREATE.ALREADY_HAVE_A_APPLICATION)
    async createApplication(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: CreateApplicationControllerDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.applicantService.createApplication(
                id,
                body
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("get-user-applications")
    @ApiResponse(APPLICATION_RESPONSES.GET_USER_APPLICATIONS.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.GET_USER_APPLICATIONS.NO_APPLICATIONS)
    async getUserApplications(
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.applicantService.getUserApplications(id);
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
