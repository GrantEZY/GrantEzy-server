import {Reflector} from "@nestjs/core";
import {Injectable, CanActivate, ExecutionContext} from "@nestjs/common";
import ApiError from "../errors/api.error";
import {AccessTokenJwt} from "../types/jwt.types";
import {UserRoles} from "../../core/domain/constants/userRoles.constants";
@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user: AccessTokenJwt = request.user;

        const role = user.userData.payload.role;

        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
            "role",
            [context.getHandler(), context.getClass()]
        );

        const isPublic = this.reflector.getAllAndOverride("isPublic", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new ApiError(
                403,
                "User Not Allowed To perform the action",
                "User Privilege Error"
            );
        }

        return true;
    }
}
