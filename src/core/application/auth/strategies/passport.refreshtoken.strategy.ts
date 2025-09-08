import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import {Request} from "express";
import {ConfigType} from "../../../../config/env/app.types";
import {JwtData, RefreshTokenJwt} from "../../../../shared/types/jwt.types";
const cookieExtractor = (request: Request): string | null => {
    let token: string | null = null;
    const jwtToken = "jwtToken";
    // eslint-disable-next-line
    if (request.cookies && request.cookies[jwtToken])
        token = request.cookies[jwtToken];
    return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    "refresh-jwt"
) {
    constructor(configService: ConfigService<ConfigType>) {
        super({
            ignoreExpiration: false,
            jwtFromRequest: cookieExtractor,
            secretOrKey: configService.get("jwt").JWT_REFRESH_TOKEN_KEY,
            passReqToCallback: true,
        });
    }

    validate(request: Request, payload: JwtData): RefreshTokenJwt {
        return {
            refreshToken: request.cookies.jwtToken,
            userData: payload,
        };
    }
}
