import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {ProgramManagerService} from "../../../../../core/domain/services/program-manager/pm.service";
import {ProgramManagerControllerPort} from "../../../../../ports/inputs/controllers/pm.controller.port";
import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetProgramCyclesDTO,
    GetCycleDetailsDTO,
    GetApplicationDetailsDTO,
} from "../../../dtos/pm.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {UpdateCycleDTO} from "../../../dtos/shared/shared.program.dto";
import {CYCLE_RESPONSES} from "../../../../../config/swagger/docs/pm.swagger";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";

@ApiTags("ProgramManager")
@Controller("pm")
export class ProgramManagerController implements ProgramManagerControllerPort {
    constructor(
        private readonly programManagerService: ProgramManagerService
    ) {}

    @Post("/create-cycle")
    @ApiResponse(CYCLE_RESPONSES.CREATE.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.CREATE.PROGRAM_NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.CREATE.BUDGET_EXCEEDS)
    async createCycle(
        @Body() createCycleDTO: CreateCycleDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result =
                await this.programManagerService.createCycle(createCycleDTO);
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
        @Query() getProgramCycle: GetProgramCyclesDTO,
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

    @Get("/get-cycle-details")
    @ApiResponse(CYCLE_RESPONSES.CYCLE_WITH_APPLICATIONS.SUCCESS)
    @ApiResponse(CYCLE_RESPONSES.CYCLE_WITH_APPLICATIONS.NOT_FOUND)
    @ApiResponse(CYCLE_RESPONSES.CYCLE_WITH_APPLICATIONS.FORBIDDEN)
    async getCycleDetails(
        @Param() parameters: GetCycleDetailsDTO,
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
        @Param() parameters: GetApplicationDetailsDTO,
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
