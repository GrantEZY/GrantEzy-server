import {
    Controller,
    Res,
    Post,
    Body,
    ValidationPipe,
    UseGuards,
    Get,
} from "@nestjs/common";
import {Response} from "express";
import {AuthUseCase} from "../../../../../core/application/auth/auth.use-case";
import {AuthControllerPort} from "../../../../../ports/inputs/controllers/auth.controller.port";
import {LoginDTO, RegisterDTO} from "../../../dtos/auth.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {ApiTags, ApiResponse} from "@nestjs/swagger";
import {
    LoginSwagger,
    LogoutSwagger,
    RefreshSwagger,
    RegisterSwagger,
} from "../../../../../config/swagger/auth.swagger";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {
    LocalLoginResponseData,
    PassportResponseData,
} from "../../../../driven/response-dtos/auth.response-dto";
import {JwtData} from "../../../../../shared/types/jwt.types";
import {User} from "../../../../../core/domain/aggregates/user.aggregate";
import {UserRoles} from "../../../../../core/domain/constants/userRoles.constants";
import {Public} from "../../../../../shared/decorators/public.decorator";
import {LocalGuard} from "../../../../../shared/guards/local.guard";
import {RtGuard} from "../../../../../shared/guards/rt.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController implements AuthControllerPort {
    constructor(private readonly authUseCase: AuthUseCase) {}

    @Public()
    @Post("/local/register")
    @ApiResponse(RegisterSwagger.SUCCESS)
    @ApiResponse(RegisterSwagger.CONFLICT)
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

    @Public()
    @Post("/local/login")
    @UseGuards(LocalGuard)
    @ApiResponse(LoginSwagger.SUCCESS)
    @ApiResponse(LoginSwagger.PASSWORD_DONT_MATCH)
    @ApiResponse(LoginSwagger.USER_DONT_HAVE_THE_ROLE)
    @ApiResponse(LoginSwagger.USER_NOT_FOUND)
    async login(
        @CurrentUser() user: PassportResponseData,
        @Body(ValidationPipe) body: LoginDTO,
        @Res() response: Response
    ) {
        try {
            const currentUser = user.user;
            if (!currentUser) {
                return response.status(401).json({
                    status: 401,
                    message: "User Not Authenticated",
                    res: null,
                });
            }
            const role = body.role;
            const result = await this.authUseCase.login(
                currentUser as unknown as User,
                role as unknown as UserRoles
            );

            const {refreshToken, ...userData} =
                result.res as unknown as LocalLoginResponseData;

            this.setCookie(response, "jwtToken", refreshToken);

            return response.status(200).json({
                status: 200,
                message: "Login Successful",
                res: userData,
            });
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @ApiResponse(LogoutSwagger.SUCCESS)
    @Post("/local/logout")
    async logout(@Res() response: Response, @CurrentUser() user: JwtData) {
        try {
            this.removeCookie(response, "jwtToken");
            const id = user.id;
            const result = await this.authUseCase.logout(
                id as unknown as string
            );
            const isLogout = result.res?.status;

            if (!isLogout) {
                return response.status(400).json({
                    status: 200,
                    message: "User Logged Out Not Successfully",
                    res: null,
                });
            }

            return response.status(200).json({
                status: 200,
                message: "User Logged Out Successfully",
                res: null,
            });
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Public()
    @Get("/local/refresh")
    @UseGuards(RtGuard)
    @ApiResponse(RefreshSwagger.SUCCESS)
    @ApiResponse(RefreshSwagger.TOKEN_MISMATCH)
    @ApiResponse(RefreshSwagger.USER_NOT_FOUND)
    async refresh(
        response: Response,
        @CurrentUser() user: JwtData
    ): Promise<Response> {
        try {
            const result = await this.authUseCase.refresh(user);

            return response.status(result.status).json({
                status: result.status,
                message: result.message,
                res: {
                    userData: user,
                    accessToken: result.res,
                },
            });
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    setCookie(response: Response, cookieName: string, value: string): void {
        const cookieOptions = {
            httpOnly: true,
            sameSite: "none" as const,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        response.cookie(cookieName, value, cookieOptions);
    }

    removeCookie(response: Response, cookieName: string): void {
        response.clearCookie(cookieName);
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
