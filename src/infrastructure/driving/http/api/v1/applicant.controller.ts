import {
    Body,
    Controller,
    Post,
    Res,
    Get,
    Delete,
    Patch,
    Query,
    UseGuards,
} from "@nestjs/common";
import {Response} from "express";
import ApiError from "../../../../../shared/errors/api.error";
import {ApplicantControllerPort} from "../../../../../ports/inputs/controllers/applicant.controller.port";
import {ApplicantService} from "../../../../../core/domain/services/applicant/applicant.service";
import {ApplicantCfgService} from "../../../../../core/domain/services/applicant/applicant.cfg.service";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import {
    AddApplicationRevenueStreamDTO,
    AddApplicationRisksAndMilestonesDTO,
    AddApplicationTeammatesDTO,
    AddApplicationTechnicalAndMarketInfoDTO,
    AddBudgetDetailsDTO,
    ApplicationDocumentsDTO,
    CreateApplicationControllerDTO,
    DeleteApplicationDTO,
    GetApplicationWithCycleDetailsDTO,
    GetProjectDetailsDTO,
    GetUserCreatedApplicationDTO,
    GetUserProjectsPaginationDTO,
    ManageTeammateDTO,
} from "../../../dtos/applicant.dto";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {
    APPLICATION_RESPONSES,
    PROJECT_RESPONSES,
    APPLICANT_CFG_RESPONSES,
} from "../../../../../config/swagger/docs/applicant.swagger";
import {Role} from "../../../../../shared/decorators/role.decorator";
import {RoleGuard} from "../../../../../shared/guards/role/role.guard";
import {UserRoles} from "../../../../../core/domain/constants/userRoles.constants";
import {RolePublic} from "../../../../../shared/decorators/role.public.decorator";
@ApiTags("Applicants")
@Controller("applicant")
@Role(UserRoles.APPLICANT)
@UseGuards(RoleGuard)
export class ApplicantController implements ApplicantControllerPort {
    constructor(
        private readonly applicantService: ApplicantService,
        private readonly applicentCfgService: ApplicantCfgService
    ) {}

    @RolePublic()
    @Post("/create-application")
    @ApiResponse(APPLICATION_RESPONSES.CREATE.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.CREATE.CYCLE_NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.CREATE.ALREADY_HAVE_A_APPLICATION)
    @ApiResponse(APPLICATION_RESPONSES.CREATE.CYCLE_NOT_ACTIVE)
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

    @RolePublic()
    @Patch("/add-application-budget")
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.FORBIDDEN)
    async addApplicationBudgetDetails(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: AddBudgetDetailsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.applicantService.addApplicationBudgetDetails(
                    id,
                    body
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @RolePublic()
    @Patch("/add-application-technical-details")
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.FORBIDDEN)
    async addApplicationTechnicalAndMarketInfoDetails(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: AddApplicationTechnicalAndMarketInfoDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.applicantService.addApplicationTechnicalAndMarketInfo(
                    id,
                    body
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @RolePublic()
    @Patch("/add-application-revenue-stream")
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.FORBIDDEN)
    async addApplicationRevenueStream(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: AddApplicationRevenueStreamDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.applicantService.addApplicationRevenueStream(
                    id,
                    body
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @RolePublic()
    @Patch("/add-application-risks-and-milestones")
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.FORBIDDEN)
    async addApplicationRisksAndMileStones(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: AddApplicationRisksAndMilestonesDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.applicantService.AddRisksAndMileStones(
                id,
                body
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @RolePublic()
    @Patch("/add-application-documents")
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.UPDATE_DETAILS.FORBIDDEN)
    async addApplicationDocuments(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: ApplicationDocumentsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.applicantService.addApplicationDocuments(
                id,
                body
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @RolePublic()
    @Patch("/add-application-teammates")
    @ApiResponse(APPLICATION_RESPONSES.TEAMMATES.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.TEAMMATES.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.TEAMMATES.FORBIDDEN)
    @ApiResponse(APPLICATION_RESPONSES.TEAMMATES.INVITE_ERROR)
    async addApplicationTeammates(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: AddApplicationTeammatesDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.applicantService.addApplicationTeamMates(
                id,
                body
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-user-applications")
    @ApiResponse(APPLICATION_RESPONSES.GET_USER_APPLICATIONS.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.GET_USER_APPLICATIONS.NO_APPLICATIONS)
    async getUserApplications(
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.applicantService.getUserApplications(id);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-application-details-with-cycle")
    @ApiResponse(APPLICATION_RESPONSES.GET_APPLICATION_WITH_CYCLE.SUCCESS)
    @ApiResponse(
        APPLICATION_RESPONSES.GET_APPLICATION_WITH_CYCLE.CYCLE_NOT_FOUND
    )
    async getApplicationDetailsWithCycle(
        @CurrentUser() user: AccessTokenJwt,
        @Query() parameter: GetApplicationWithCycleDetailsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.applicantService.getApplicationDetailsWithCycle(
                    id,
                    parameter.cycleSlug
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-user-created-applications")
    @ApiResponse(APPLICATION_RESPONSES.GET_USER_CREATED_APPLICATION.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.GET_USER_CREATED_APPLICATION.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.GET_USER_CREATED_APPLICATION.FORBIDDEN)
    async getUserCreatedApplicationDetails(
        @CurrentUser() user: AccessTokenJwt,
        @Query() parameter: GetUserCreatedApplicationDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.applicantService.getUserCreatedApplicationDetails(
                    parameter.applicationId,
                    id
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Delete("/delete-user-application")
    @ApiResponse(APPLICATION_RESPONSES.DELETE.SUCCESS)
    @ApiResponse(APPLICATION_RESPONSES.DELETE.NOT_FOUND)
    @ApiResponse(APPLICATION_RESPONSES.DELETE.FORBIDDEN)
    @ApiResponse(APPLICATION_RESPONSES.DELETE.IN_REVIEW)
    async deleteUserApplication(
        @CurrentUser() user: AccessTokenJwt,
        @Body() body: DeleteApplicationDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.applicantService.deleteApplication(
                id,
                body.applicationId
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-user-created-projects")
    @ApiResponse(PROJECT_RESPONSES.GET_USER_PROJECTS.SUCCESS)
    async getUserCreatedProjects(
        @Query() parameters: GetUserProjectsPaginationDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.applicantService.getUserProjects(
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
    @ApiResponse(PROJECT_RESPONSES.GET_PROJECT_DETAILS.SUCCESS)
    @ApiResponse(PROJECT_RESPONSES.GET_PROJECT_DETAILS.FORBIDDEN)
    @ApiResponse(PROJECT_RESPONSES.GET_PROJECT_DETAILS.NOT_A_PROJECT)
    @ApiResponse(PROJECT_RESPONSES.GET_PROJECT_DETAILS.APPLICATION_NOT_FOUND)
    async getProjectDetails(
        @Query() parameters: GetProjectDetailsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.applicantService.getProjectDetails(
                parameters.applicationSlug,
                id
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/add-teammates-for-application")
    @ApiResponse(APPLICANT_CFG_RESPONSES.ADD_TEAMMATE.SUCCESS)
    @ApiResponse(APPLICANT_CFG_RESPONSES.ADD_TEAMMATE.INVITE_ERROR)
    @ApiResponse(APPLICANT_CFG_RESPONSES.ADD_TEAMMATE.SELF_INVITE)
    @ApiResponse(APPLICANT_CFG_RESPONSES.ADD_TEAMMATE.APPLICATION_NOT_FOUND)
    @ApiResponse(APPLICANT_CFG_RESPONSES.ADD_TEAMMATE.USER_NOT_FOUND)
    async addTeamMatesToApplication(
        @Body() body: ManageTeammateDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.applicentCfgService.addTeamMatesToApplication(
                    body,
                    id
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Delete("/remove-teammates-for-application")
    @ApiResponse(APPLICANT_CFG_RESPONSES.REMOVE_TEAMMATE.SUCCESS)
    @ApiResponse(APPLICANT_CFG_RESPONSES.REMOVE_TEAMMATE.NOT_A_TEAMMATE)
    @ApiResponse(APPLICANT_CFG_RESPONSES.REMOVE_TEAMMATE.TEAMMATE_NOT_FOUND)
    @ApiResponse(APPLICANT_CFG_RESPONSES.REMOVE_TEAMMATE.USER_NOT_FOUND)
    @ApiResponse(APPLICANT_CFG_RESPONSES.REMOVE_TEAMMATE.APPLICATION_NOT_FOUND)
    async removeTeamMatesToApplication(
        @Body() body: ManageTeammateDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.applicentCfgService.removeTeamMateFromApplication(
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
