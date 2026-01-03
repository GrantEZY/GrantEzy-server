import {
    Controller,
    Res,
    Get,
    Query,
    Post,
    Body,
    Patch,
    Delete,
    UseGuards,
} from "@nestjs/common";
import {ApiTags, ApiResponse, ApiProperty} from "@nestjs/swagger";
import {Response} from "express";
import {AdminControllerPort} from "../../../../../ports/inputs/controllers/admin.controller.port";
import ApiError from "../../../../../shared/errors/api.error";
import {AdminService} from "../../../../../core/domain/services/admin/admin.service";
import {GetAllUsersDTO, GetUserProfileDTO} from "../../../dtos/admin.dto";
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
    ORGANIZATION_RESPONSES,
    USER_PROFILE,
} from "../../../../../config/swagger/docs/admin.swagger";
import {
    CreateOrganizationDTO,
    UpdateOrganizationDTO,
} from "../../../dtos/shared/shared.organization.dto";
import {Role} from "../../../../../shared/decorators/role.decorator";
import {UserRoles} from "../../../../../core/domain/constants/userRoles.constants";
import {RoleGuard} from "../../../../../shared/guards/role.guard";
@ApiTags("Admin")
@Controller("admin")
@Role(UserRoles.ADMIN)
@UseGuards(RoleGuard)
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
    @ApiProperty(ADD_USERS.ERROR_IN_ADDING_ROLE)
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

    @Get("/get-user-profile")
    @ApiResponse(USER_PROFILE.SUCCESS)
    async getUserProfile(
        @Query() query: GetUserProfileDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.adminService.getUserProfile(query);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/add-organization")
    @ApiResponse(ORGANIZATION_RESPONSES.CREATE.SUCCESS)
    @ApiResponse(ORGANIZATION_RESPONSES.CREATE.ORGANISATION_ALREADY_FOUND)
    async addOrganization(
        @Body() body: CreateOrganizationDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const result = await this.adminService.addOrganization(body);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-organizations")
    @ApiResponse(ORGANIZATION_RESPONSES.GET_ALL.SUCCESS)
    async getAllOrganizations(@Res() response: Response): Promise<Response> {
        try {
            const result = await this.adminService.getOrganizations();
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Delete("/delete-organization")
    @ApiResponse(ORGANIZATION_RESPONSES.DELETE.SUCCESS)
    @ApiResponse(ORGANIZATION_RESPONSES.DELETE.NOT_FOUND)
    async deleteOrganization(
        @Res() response: Response,
        @Body() organizationDetails: {id: string}
    ): Promise<Response> {
        try {
            const result = await this.adminService.deleteOrganization(
                organizationDetails.id
            );
            return response.status(200).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/update-organization")
    @ApiResponse(ORGANIZATION_RESPONSES.UPDATE.SUCCESS)
    @ApiResponse(ORGANIZATION_RESPONSES.UPDATE.NOT_FOUND)
    async updateOrganization(
        @Res() response: Response,
        @Body() organizationDetails: UpdateOrganizationDTO
    ): Promise<Response> {
        try {
            const result =
                await this.adminService.updateOrganization(organizationDetails);
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
