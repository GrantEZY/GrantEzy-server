import {Body, Controller, Post, Res} from "@nestjs/common";
import {Response} from "express";
import {ApiTags} from "@nestjs/swagger";
import {ProjectManagementControllerPort} from "../../../../../ports/inputs/controllers/project.management.controller.port";
import {CreateProjectDTO} from "../../../dtos/project.management.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {ProjectManagementService} from "../../../../../core/domain/services/project-management/project.management.service";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
@ApiTags("Project Management")
@Controller("pt-management")
export class ProjectManagementController
    implements ProjectManagementControllerPort
{
    constructor(
        private readonly projectManagementService: ProjectManagementService
    ) {}

    @Post("/create-project")
    async createProject(
        @Body() body: CreateProjectDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.projectManagementService.createProject(
                body,
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
