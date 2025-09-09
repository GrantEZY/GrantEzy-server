import {Controller, Res, Get, Query} from "@nestjs/common";
import {ApiTags, ApiResponse} from "@nestjs/swagger";
import {Response} from "express";
import {AdminControllerInterfacePort} from "../../../../../ports/inputs/controllers/admin.controller.port";
import ApiError from "../../../../../shared/errors/api.error";
import {AdminService} from "../../../../../core/domain/services/admin.service";
import {GetAllUsersDTO} from "../../../dtos/admin.dto";
import {GET_ALL_USERS} from "../../../../../config/swagger/admin.swagger";
@ApiTags("Admin")
@Controller("admin")
export class AdminController implements AdminControllerInterfacePort {
    constructor(private readonly adminService: AdminService) {}

    @Get("/get-users")
    @ApiResponse(GET_ALL_USERS.SUCCESS)
    @ApiResponse(GET_ALL_USERS.NO_USERS_PRESENT)
    async getAllUsers(
        @Res() response: Response,
        @Query() query: GetAllUsersDTO
    ): Promise<Response> {
        try {
            const result = await this.adminService.getAllUsers(query);
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
