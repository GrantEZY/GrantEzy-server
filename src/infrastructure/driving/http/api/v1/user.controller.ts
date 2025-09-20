import {Body, Controller, Get, Patch, Res} from "@nestjs/common";
import ApiError from "../../../../../shared/errors/api.error";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserControllerPort} from "../../../../../ports/inputs/controllers/user.controller.port";
import {Response} from "express";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import {UserService} from "../../../../../core/domain/services/user/user.service";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {USER_RESPONSES} from "../../../../../config/swagger/docs/user.swagger";
import {UpdateProfileDTO} from "../../../dtos/user.dto";

@ApiTags("Users")
@Controller("user")
export class UserController implements UserControllerPort {
    constructor(private readonly userService: UserService) {}

    @Get("/user-profile")
    @ApiResponse(USER_RESPONSES.GET_ACCOUNT.SUCCESS)
    @ApiResponse(USER_RESPONSES.GET_ACCOUNT.NOT_FOUND)
    async getUserAccount(
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.userService.getAccount(id);
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Patch("/update-profile")
    @ApiResponse(USER_RESPONSES.UPDATE_PROFILE.SUCCESS)
    @ApiResponse(USER_RESPONSES.UPDATE_PROFILE.NOT_FOUND)
    async UpdateUserProfile(
        @CurrentUser() user: AccessTokenJwt,
        @Body() updateDetails: UpdateProfileDTO,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.userService.updateUserProfile(
                updateDetails,
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
