import {
    Controller,
    Res,
    Get,
    Query,
    Post,
    Body,
    Patch,
    Delete,
} from "@nestjs/common";
import {ApiTags, ApiResponse, ApiProperty} from "@nestjs/swagger";
import {Response} from "express";
import {AdminControllerPort} from "../../../../../ports/inputs/controllers/admin.controller.port";
import ApiError from "../../../../../shared/errors/api.error";
import {AdminService} from "../../../../../core/domain/services/admin/admin.service";
import {GetAllUsersDTO} from "../../../dtos/admin.dto";
import {
    AddUserDTO,
    DeleteUserDTO,
    UpdateUserRoleDTO,
} from "../../../dtos/shared/shared.user.dto";
import {
    GET_ALL_USERS,
    ADD_USERS,
    UPDATE_USER_ROLE,
    DELETE_USER,
} from "../../../../../config/swagger/docs/admin.swagger";
@ApiTags("Admin")
@Controller("admin")
export class AdminController implements AdminControllerPort {
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

    @Post("/add-user")
    @ApiProperty(ADD_USERS.SUCCESS)
    @ApiProperty(ADD_USERS.USER_ALREADY_PRESENT)
    async addUser(@Body() body: AddUserDTO, @Res() response: Response) {
        try {
            const result = await this.adminService.addUser(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/update-role")
    @ApiProperty(UPDATE_USER_ROLE.SUCCESS)
    @ApiProperty(UPDATE_USER_ROLE.ALREADY_ROLE_LINKED)
    async updateRole(
        @Res() response: Response,
        @Body() userDetails: UpdateUserRoleDTO
    ) {
        try {
            const result = await this.adminService.updateUserRole(userDetails);

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Delete("/delete-user")
    @ApiProperty(DELETE_USER.SUCCESS)
    @ApiProperty(DELETE_USER.USER_NOT_FOUND)
    async deleteUser(
        @Res() response: Response,
        @Body() userDetails: DeleteUserDTO
    ) {
        try {
            const result = await this.adminService.deleteUser(userDetails);
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
