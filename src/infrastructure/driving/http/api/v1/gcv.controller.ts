import {Controller, Res, Body, Post, Patch, Get, Query} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {GCVControllerPort} from "../../../../../ports/inputs/controllers/gcv.controller.port";
import {GCVService} from "../../../../../core/domain/services/gcv/gcv.service";
import {
    GCVMemberAddDTO,
    GetAllGCVUsersDTO,
    UpdateGCVUserRoleDTO,
} from "../../../dtos/gcv.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {Response} from "express";
import {
    GET_GCV_MEMBERS,
    ADD_GCV_USERS,
    UPDATE_GCV_USER_ROLE,
} from "../../../../../config/swagger/docs/gcv.swagger";
@ApiTags("GCV-Only")
@Controller("gcv")
export class GCVController implements GCVControllerPort {
    constructor(private readonly gcvService: GCVService) {}

    @Post("/add-gcv-member")
    @ApiResponse(ADD_GCV_USERS.SUCCESS)
    @ApiResponse(ADD_GCV_USERS.USER_ALREADY_PRESENT)
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
    @ApiResponse(GET_GCV_MEMBERS.SUCCESS)
    @ApiResponse(GET_GCV_MEMBERS.NO_USERS_PRESENT)
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
    @ApiResponse(UPDATE_GCV_USER_ROLE.SUCCESS)
    @ApiResponse(UPDATE_GCV_USER_ROLE.ALREADY_ROLE_LINKED)
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
