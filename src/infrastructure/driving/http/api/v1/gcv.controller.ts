import {
    Controller,
    Res,
    Body,
    Post,
    Patch,
    Get,
    Query,
    Delete,
    UseGuards,
} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {GCVControllerPort} from "../../../../../ports/inputs/controllers/gcv.controller.port";
import {GCVService} from "../../../../../core/domain/services/gcv/gcv.service";
import {
    AddProgramManagerDTO,
    DeleteProgramDTO,
    GCVMemberAddDTO,
    GetAllGCVUsersDTO,
    UpdateGCVUserRoleDTO,
    UpdateProgramManagerDTO,
} from "../../../dtos/gcv.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {Response} from "express";
import {GCV_RESPONSES} from "../../../../../config/swagger/docs/gcv.swagger";
import {CreateProgramDTO} from "../../../dtos/gcv.dto";
import {UpdateProgramDTO} from "../../../dtos/shared/shared.program.dto";
import {GetAllProgramDTO} from "../../../dtos/shared/shared.program.dto";
import {
    GetProgramCyclesDTO,
    GetCycleDetailsDTO,
    GetApplicationDetailsDTO,
} from "../../../dtos/pm.dto";
import {UserRoles} from "../../../../../core/domain/constants/userRoles.constants";
import {Role} from "../../../../../shared/decorators/role.decorator";
import {RoleGuard} from "../../../../../shared/guards/role.guard";
@ApiTags("GCV-Only")
@Controller("gcv")
export class GCVController implements GCVControllerPort {
    constructor(private readonly gcvService: GCVService) {}

    @Post("/add-gcv-member")
    @Role(UserRoles.DIRECTOR)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.ADD_MEMBER.CREATED_NEW)
    @ApiResponse(GCV_RESPONSES.ADD_MEMBER.SUCCESS)
    @ApiResponse(GCV_RESPONSES.ADD_MEMBER.ERROR)
    async addGcvMembers(
        @Body() body: GCVMemberAddDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.addGCVMember(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-gcv-members")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.GET_MEMBERS.SUCCESS)
    @ApiResponse(GCV_RESPONSES.GET_MEMBERS.NO_USERS_PRESENT)
    async getAllMembers(
        @Res() response: Response,
        @Query() query: GetAllGCVUsersDTO
    ): Promise<Response> {
        try {
            const result = await this.gcvService.getAllGCVmembers(query);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/update-gcv-role")
    @Role(UserRoles.DIRECTOR)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.UPDATE_MEMBER_ROLE.SUCCESS)
    @ApiResponse(GCV_RESPONSES.UPDATE_MEMBER_ROLE.USER_NOT_FOUND)
    async updateGCVMemberRole(
        @Body() body: UpdateGCVUserRoleDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.updateGCVUserRole(body);

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/create-program")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.CREATE_PROGRAM.SUCCESS)
    @ApiResponse(GCV_RESPONSES.CREATE_PROGRAM.DUPLICATE)
    async createProgram(
        @Body() body: CreateProgramDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.createProgram(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-programs")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.GET_PROGRAMS.SUCCESS)
    async getAllPrograms(
        @Query() query: GetAllProgramDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.getPrograms(query);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/update-program")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.UPDATE_PROGRAM.SUCCESS)
    @ApiResponse(GCV_RESPONSES.UPDATE_PROGRAM.ERROR)
    async updateProgram(
        @Body() body: UpdateProgramDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.updateProgram(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Delete("/delete-program")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.DELETE_PROGRAM.SUCCESS)
    @ApiResponse(GCV_RESPONSES.DELETE_PROGRAM.NOT_FOUND)
    @ApiResponse(GCV_RESPONSES.DELETE_PROGRAM.ERROR)
    async deleteProgram(
        @Body() body: DeleteProgramDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.deleteProgram(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/add-program-manager")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.SUCCESS)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.PROGRAM_NOT_FOUND)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.USER_NOT_FOUND)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.MANAGER_ALREADY_ASSIGNED)
    async addProgramManager(
        @Body() body: AddProgramManagerDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.addProgramManager(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/update-program-manager")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.SUCCESS)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.PROGRAM_NOT_FOUND)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.USER_NOT_FOUND)
    @ApiResponse(GCV_RESPONSES.ADD_PROGRAM_MANAGER.MANAGER_ALREADY_ASSIGNED)
    async updateProgramManager(
        @Body() body: UpdateProgramManagerDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.addProgramManager(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-program-cycles")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.PROGRAM_CYCLES.SUCCESS)
    @ApiResponse(GCV_RESPONSES.PROGRAM_CYCLES.NO_CYCLES_FOUND)
    async getProgramCycles(
        @Query() parameters: GetProgramCyclesDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.getProgramCycles(parameters);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-cycle-details")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.CYCLE_WITH_APPLICATIONS.SUCCESS)
    @ApiResponse(GCV_RESPONSES.CYCLE_WITH_APPLICATIONS.NOT_FOUND)
    async getCycleDetails(
        @Query() parameters: GetCycleDetailsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.getCycleWithApplications(
                parameters.cycleSlug
            );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-cycle-application-details")
    @Role(UserRoles.DIRECTOR, UserRoles.COMMITTEE_MEMBER)
    @UseGuards(RoleGuard)
    @ApiResponse(GCV_RESPONSES.APPLICATION_DETAILS.SUCCESS)
    @ApiResponse(GCV_RESPONSES.APPLICATION_DETAILS.APPLICATION_MISMATCH)
    @ApiResponse(GCV_RESPONSES.APPLICATION_DETAILS.APPLICATION_NOT_FOUND)
    @ApiResponse(GCV_RESPONSES.APPLICATION_DETAILS.CYCLE_NOT_FOUND)
    async getApplicationDetails(
        @Query() parameters: GetApplicationDetailsDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.gcvService.getApplicationDetails(
                parameters.cycleSlug,
                parameters.applicationSlug
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
