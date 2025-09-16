import {Body, Controller, Delete, Get, Post, Query, Res} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {ProgramManagerService} from "../../../../../core/domain/services/program-manager/pm.service";
import {ProgramManagerControllerPort} from "../../../../../ports/inputs/controllers/pm.controller.port";
import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetProgramCyclesDTO,
} from "../../../dtos/pm.dto";
import ApiError from "../../../../../shared/errors/api.error";
@ApiTags("ProgramManager")
@Controller("pm")
export class ProgramManagerController implements ProgramManagerControllerPort {
    constructor(
        private readonly programManagerService: ProgramManagerService
    ) {}

    @Post("/create-cycle")
    async createCycle(
        @Body() createCycleDTO: CreateCycleDTO,
        response: Response
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
    async getProgramCycles(
        @Query() getProgramCycle: GetProgramCyclesDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result =
                await this.programManagerService.getProgramCycles(
                    getProgramCycle
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Delete("/delete-program-cycle")
    async deleteCycle(
        deleteCycle: DeleteCycleDTO,
        response: Response
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
