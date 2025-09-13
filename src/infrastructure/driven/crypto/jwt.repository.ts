import {ConfigService} from "@nestjs/config";
import {JwtPort} from "../../../ports/outputs/crypto/jwt.port";
import {SignJwtTokenData} from "../../../shared/types/jwt.types";
import {
    LoginTokenSigningData,
    RefreshAccessTokenData,
} from "../response-dtos/jwt.response-dto";
import {ConfigType} from "../../../config/env/app.types";
import {JwtService} from "@nestjs/jwt";
import ApiError from "../../../shared/errors/api.error";
import {Injectable} from "@nestjs/common";

@Injectable()
export class JwtRepository implements JwtPort {
    constructor(
        private readonly configService: ConfigService<ConfigType>,
        private readonly jwtService: JwtService
    ) {}

    /**
     *
     * @param jwtData data for signing tokens
     * @returns returns accessToken and refreshToken
     */
    async signTokens(
        jwtData: SignJwtTokenData
    ): Promise<LoginTokenSigningData> {
        try {
            const REFRESH_TOKEN_KEY =
                this.configService.get("jwt").JWT_REFRESH_TOKEN_KEY;
            const ACCESS_TOKEN_KEY =
                this.configService.get("jwt").JWT_TOKEN_KEY;

            const accessToken = await this.jwtService.signAsync(
                {payload: jwtData},
                {
                    secret: ACCESS_TOKEN_KEY,
                    expiresIn: "1h",
                }
            );

            const refreshToken = await this.jwtService.signAsync(
                {payload: jwtData},
                {
                    secret: REFRESH_TOKEN_KEY,
                    expiresIn: "7d",
                }
            );

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            console.error("Jwt Repository Error", error);
            throw new ApiError(400, "Error in Signing JWT", "JWT error");
        }
    }

    /**
     *
     * @param jwtData data for signing accessToken
     * @returns returns accessToken
     */

    async getAccessToken(
        jwtData: SignJwtTokenData
    ): Promise<RefreshAccessTokenData> {
        try {
            const ACCESS_TOKEN_KEY =
                this.configService.get("jwt").JWT_TOKEN_KEY;

            const accessToken = await this.jwtService.signAsync(
                {payload: jwtData},
                {
                    secret: ACCESS_TOKEN_KEY,
                    expiresIn: "1h",
                }
            );

            return {
                accessToken,
            };
        } catch (error) {
            console.error("Jwt Repository Error", error);
            throw new ApiError(400, "Error in Signing JWT", "JWT error");
        }
    }
}
