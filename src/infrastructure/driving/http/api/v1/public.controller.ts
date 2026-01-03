import {PublicControllerPort} from "../../../../../ports/inputs/controllers/public.controller.port";
import {
    getActiveProgramFilterDTO,
    GetProgramCycleDetailsDTO,
} from "../../../dtos/public.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Query, Res} from "@nestjs/common";
import {Response} from "express";
import {PublicService} from "../../../../../core/domain/services/public/public.service";
import {PUBLIC_RESPONSES} from "../../../../../config/swagger/docs/public.swagger";
import {Public} from "../../../../../shared/decorators/auth.public.decorator";
@ApiTags("Public")
@Controller("public")
@Public()
export class PublicController implements PublicControllerPort {
    constructor(private readonly publicService: PublicService) {}

    @Get("/active-program-cycles")
    @ApiResponse(PUBLIC_RESPONSES.GET_ACTIVE_PROGRAMS.SUCCESS)
    async getActiveProgramCycles(
        @Query() parameters: getActiveProgramFilterDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result =
                await this.publicService.getActiveProgramCycles(parameters);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/program-cycle-details")
    @ApiResponse(PUBLIC_RESPONSES.GET_PROGRAM_CYCLE_DETAILS.SUCCESS)
    @ApiResponse(PUBLIC_RESPONSES.GET_PROGRAM_CYCLE_DETAILS.PROGRAM_NOT_FOUND)
    @ApiResponse(PUBLIC_RESPONSES.GET_PROGRAM_CYCLE_DETAILS.PROGRAM_INACTIVE)
    @ApiResponse(
        PUBLIC_RESPONSES.GET_PROGRAM_CYCLE_DETAILS.NO_ACTIVE_CYCLE_FOUND
    )
    @ApiResponse(PUBLIC_RESPONSES.GET_PROGRAM_CYCLE_DETAILS.ERROR)
    async getProgramCycleDetails(
        @Query() parameters: GetProgramCycleDetailsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.publicService.getProgramCycleDetails(
                parameters.slug
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
