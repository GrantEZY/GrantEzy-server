import {Controller, Res, Post, Body, ValidationPipe} from "@nestjs/common";
import {Response} from "express";
import {AuthUseCase} from "../../../../../core/application/auth/auth.use-case";
import {AuthControllerPort} from "../../../../../core/ports/inputs/controllers/auth.controller.port";
import {RegisterDTO} from "../../../dtos/auth.dto";
import ApiError from "../../../../../shared/errors/api.error";

@Controller("auth")
export class AuthController implements AuthControllerPort {
    constructor(private readonly authUseCase: AuthUseCase) {}

    @Post("/local/register")
    async register(
        @Body(ValidationPipe) userData: RegisterDTO,
        @Res() response: Response
    ) {
        try {
            const result = await this.authUseCase.register(userData);
            return response.status(result.status).json({
                status: 201,
                message: "User registered successfully",
                res: result,
            });
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    handleError(error: unknown, response: Response) {
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
