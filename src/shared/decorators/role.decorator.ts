import {SetMetadata} from "@nestjs/common";
import {UserRoles} from "../../core/domain/constants/userRoles.constants";
export const Role = (...roles: UserRoles[]) => SetMetadata("role", roles);
