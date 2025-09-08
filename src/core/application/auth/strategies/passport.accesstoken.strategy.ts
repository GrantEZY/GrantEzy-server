import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import {ConfigType} from "../../../../config/env/app.types";
import {JwtData} from "../../../../shared/types/jwt.types";
const headerExtractor = (request: Request) => {
    let token = null;
    if (request.headers) {
        const header = request.headers.get("authentication");
        let parts;
        if (header) {
            parts = header.split(" ");
        } else {
            return null;
        }

        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        } else {
            return null;
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
    async validate(payload: JwtData): Promise<JwtData> {
        return payload;
    }
}
