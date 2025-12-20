import {
    Body,
    Controller,
    Delete,
    Get,
    Query,
    Patch,
    Post,
    Res,
} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {ProgramManagerService} from "../../../../../core/domain/services/program-manager/pm.service";
import {ProgramManagerControllerPort} from "../../../../../ports/inputs/controllers/pm.controller.port";
import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetCycleDetailsDTO,
    GetApplicationDetailsDTO,
    GetPMProgramCyclesDTO,
    InviteReviewerDTO,
    GetApplicationReviewsDTO,
    GetApplicationReviewDetailsDTO,
    ModifyCycleStatusDTO,
} from "../../../dtos/pm.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {UpdateCycleDTO} from "../../../dtos/shared/shared.program.dto";
import {
    CYCLE_RESPONSES,
    APPLICATION_REVIEW_RESPONSES,
} from "../../../../../config/swagger/docs/pm.swagger";
import {PM_CONFIG_MNGMT} from "../../../../../config/swagger/docs/pm.cfg.management.swagger";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import {ProgramManagerConfigManagementService} from "../../../../../core/domain/services/program-manager/pm.cfg.management.service";
import {CycleStatus} from "../../../../../core/domain/constants/status.constants";

@ApiTags("ProgramManager")
@Controller("pm")
export class ProgramManagerController implements ProgramManagerControllerPort {
    constructor(
        private readonly programManagerService: ProgramManagerService,
        private readonly configManagementService: ProgramManagerConfigManagementService
    ) {}

    @Post("/create-cycle")
    @ApiResponse(CYCLE_RESPONSES.CREATE.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.CREATE.PROGRAM_NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.CREATE.BUDGET_EXCEEDS)
    async createCycle(
        @Body() createCycleDTO: CreateCycleDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.programManagerService.createCycle(
                createCycleDTO,
                id
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-program-cycles")
    @ApiResponse(CYCLE_RESPONSES.PROGRAM_CYCLES_READ.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.PROGRAM_CYCLES_READ.CONFLICT)
    @ApiResponse(CYCLE_RESPONSES.PROGRAM_CYCLES_READ.NO_CYCLES_FOUND)
    async getProgramCycles(
        @Query() getProgramCycle: GetPMProgramCyclesDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.programManagerService.getProgramCycles(
                getProgramCycle,
                id
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/update-cycle-details")
    @ApiResponse(CYCLE_RESPONSES.UPDATE.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.UPDATE.CYCLE_NOT_FOUND)
    async updateCycleDetails(
        @Body() updateCycleDetails: UpdateCycleDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result =
                await this.programManagerService.updateCycle(
                    updateCycleDetails
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }
    @Delete("/delete-program-cycle")
    @ApiResponse(CYCLE_RESPONSES.DELETE.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.DELETE.CYCLE_NOT_FOUND)
    async deleteCycle(
        @Body() deleteCycle: DeleteCycleDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result =
                await this.programManagerService.deleteProgramCycle(
                    deleteCycle
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-pm-program")
    @ApiResponse(CYCLE_RESPONSES.PROGRAM_READ.SUCCESS_PROGRAM_FETCH)
    @ApiResponse(CYCLE_RESPONSES.PROGRAM_READ.PROGRAM_NOT_FOUND)
    async getProgramManagerProgram(
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.programManagerService.getProgramManagerProgram(id);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-cycle-details")
    @ApiResponse(CYCLE_RESPONSES.CYCLE_WITH_APPLICATIONS.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.CYCLE_WITH_APPLICATIONS.NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.CYCLE_WITH_APPLICATIONS.FORBIDDEN)
    async getCycleDetails(
        @Query() parameters: GetCycleDetailsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.programManagerService.getCycleWithApplications(
                    parameters.cycleSlug,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-application-details")
    @ApiResponse(CYCLE_RESPONSES.APPLICATION_DETAILS.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.APPLICATION_DETAILS.APPLICATION_MISMATCH)
    @ApiResponse(CYCLE_RESPONSES.APPLICATION_DETAILS.APPLICATION_NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.APPLICATION_DETAILS.CYCLE_NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.APPLICATION_DETAILS.FORBIDDEN)
    async getApplicationDetails(
        @Query() parameters: GetApplicationDetailsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.programManagerService.getApplicationDetails(
                    parameters.cycleSlug,
                    parameters.applicationSlug,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/invite-application-reviewer")
    @ApiResponse(CYCLE_RESPONSES.INVITE_REVIEWER.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.INVITE_REVIEWER.APPLICATION_NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.INVITE_REVIEWER.CYCLE_NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.INVITE_REVIEWER.USER_NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.INVITE_REVIEWER.UNAUTHORIZED_MANAGER)
    async inviteApplicationReviewer(
        @Body() body: InviteReviewerDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.programManagerService.inviteReviewerForApplication(
                    body,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-application-reviews")
    @ApiResponse(APPLICATION_REVIEW_RESPONSES.GET_APPLICATION_REVIEWS.SUCCESS)
    @ApiResponse(
        APPLICATION_REVIEW_RESPONSES.GET_APPLICATION_REVIEWS
            .APPLICATION_NOT_FOUND
    )
    @ApiResponse(
        APPLICATION_REVIEW_RESPONSES.GET_APPLICATION_REVIEWS
            .APPLICATION_MISMATCH
    )
    @ApiResponse(
        APPLICATION_REVIEW_RESPONSES.GET_APPLICATION_REVIEWS
            .UNAUTHORIZED_MANAGER
    )
    async getApplicationReviews(
        @Query() parameters: GetApplicationReviewsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.programManagerService.getApplicationReviews(
                    parameters.cycleSlug,
                    parameters.applicationSlug,
                    parameters.page,
                    parameters.numberOfResults,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-application-review-details")
    @ApiResponse(APPLICATION_REVIEW_RESPONSES.GET_REVIEW_DETAILS.SUCCESS)
    @ApiResponse(
        APPLICATION_REVIEW_RESPONSES.GET_REVIEW_DETAILS.APPLICATION_NOT_FOUND
    )
    @ApiResponse(
        APPLICATION_REVIEW_RESPONSES.GET_REVIEW_DETAILS.APPLICATION_MISMATCH
    )
    @ApiResponse(
        APPLICATION_REVIEW_RESPONSES.GET_REVIEW_DETAILS.UNAUTHORIZED_MANAGER
    )
    @ApiResponse(
        APPLICATION_REVIEW_RESPONSES.GET_REVIEW_DETAILS.REVIEW_NOT_FOUND
    )
    async getApplicationReviewDetails(
        @Query() parameters: GetApplicationReviewDetailsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.programManagerService.getReviewDetails(
                parameters.cycleSlug,
                parameters.applicationSlug,
                parameters.reviewSlug,
                id
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/open-cycle-for-application")
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.SUCCESS)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.UNAUTHORIZED_MANAGER)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.INVALID_STATUS)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.CYCLE_NOT_FOUND)
    async openCycleForApplication(
        @Body() body: ModifyCycleStatusDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.configManagementService.modifyCycleStatus(
                body,
                CycleStatus.OPEN,
                id
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/close-cycle-for-application")
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.SUCCESS)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.UNAUTHORIZED_MANAGER)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.INVALID_STATUS)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.CYCLE_NOT_FOUND)
    async closeCycleForApplication(
        @Body() body: ModifyCycleStatusDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.configManagementService.modifyCycleStatus(
                body,
                CycleStatus.CLOSED,
                id
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/archive-cycle")
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.SUCCESS)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.UNAUTHORIZED_MANAGER)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.INVALID_STATUS)
    @ApiResponse(PM_CONFIG_MNGMT.MODIFY_CYCLE_STATUS.CYCLE_NOT_FOUND)
    async archiveCycle(
        @Body() body: ModifyCycleStatusDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.configManagementService.modifyCycleStatus(
                body,
                CycleStatus.ARCHIVED,
                id
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    handleError(error: unknown, response: Response): Response {
        if (error instanceof ApiError) {
            return response.status(error.status).json({
                status: error.status,
                message: error.message,
                res: null,
            });
        }
        return response.status(500).json({
            status: 500,
            message: "Internal Server Error",
            res: null,
        });
    }
}
