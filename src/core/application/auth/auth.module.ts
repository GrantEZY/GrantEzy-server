import {Module} from "@nestjs/common";
import {AuthController} from "../../../infrastructure/driving/http/api/v1/auth.controller";
import {AuthService} from "../../domain/services/auth/auth.service";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/passport.local.strategy";
import {AccessTokenStrategy} from "./strategies/passport.accesstoken.strategy";
import {RefreshTokenStrategy} from "./strategies/passport.refreshtoken.strategy";
@Module({
    imports: [PassportModule.register({defaultStrategy: "jwt"})],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        AccessTokenStrategy,
        RefreshTokenStrategy,
    ],
    exports: [PassportModule],
})
export class AuthModule {}
