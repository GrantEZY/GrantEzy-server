import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {LoginDTO} from "../../../../infrastructure/driving/dtos/auth.dto";
import {PassportResponseData} from "../../../../infrastructure/driven/response-dtos/auth.response-dto";
import {UserRoles} from "../../../domain/constants/userRoles.constants";
import {AuthUseCase} from "../auth.use-case";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authUseCase: AuthUseCase) {
        super({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        });
    }

    async validate(
        request: Request,
        email: string,
        password: string
    ): Promise<PassportResponseData> {
        const body = request.body as unknown as {role: UserRoles};
        const role = body?.role;
        const loginData = {
            email,
            password,
            role,
        } as unknown as LoginDTO;

        return this.authUseCase.validateUser(loginData);
    }
}
