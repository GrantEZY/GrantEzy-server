/* eslint-disable  */

import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import {ConfigType} from "../../../../config/env/app.types";
import {AccessTokenJwt, JwtData} from "../../../../shared/types/jwt.types";
import {Request} from "express";
const headerExtractor = (request: Request) => {
    let token = null;
    if (request.headers && request.headers["authorization"]) {
        const parts = request.headers["authorization"].split(" ");

        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }
    return token;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(configService: ConfigService<ConfigType>) {
        // eslint-disable-next-line
        super({
            ignoreExpiration: false,
            jwtFromRequest: headerExtractor,
            secretOrKey: configService.get("jwt").JWT_TOKEN_KEY,
        });
    }

    //eslint-disable-next-line
    async validate(payload: JwtData): Promise<AccessTokenJwt> {
        return {
            userData: payload,
        };
    }
}
