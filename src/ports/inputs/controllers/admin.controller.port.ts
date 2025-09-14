import {Response} from "express";
import {GetAllUsersDTO} from "../../../infrastructure/driving/dtos/admin.dto";
import {
    AddUserDTO,
    DeleteUserDTO,
    UpdateUserRoleDTO,
} from "../../../infrastructure/driving/dtos/shared/shared.user.dto";
import {
    CreateOrganizationDTO,
    UpdateOrganizationDTO,
} from "../../../infrastructure/driving/dtos/shared/shared.organization.dto";

export interface AdminControllerPort {
    getAllUsers(response: Response, query: GetAllUsersDTO): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
    addUser(body: AddUserDTO, response: Response): Promise<Response>;
    addOrganization(
        body: CreateOrganizationDTO,
        response: Response
    ): Promise<Response>;
    getAllOrganizations(response: Response): Promise<Response>;
    updateOrganization(
        response: Response,
        organizationDetails: UpdateOrganizationDTO
    ): Promise<Response>;
    deleteOrganization(
        response: Response,
        organizationDetails: {id: string}
    ): Promise<Response>;
    updateRole(
        response: Response,
        userDetails: UpdateUserRoleDTO
    ): Promise<Response>;
    deleteUser(
        response: Response,
        userDetails: DeleteUserDTO
    ): Promise<Response>;
}
