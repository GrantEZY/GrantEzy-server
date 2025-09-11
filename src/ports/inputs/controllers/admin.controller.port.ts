import {Response} from "express";
import {GetAllUsersDTO} from "../../../infrastructure/driving/dtos/admin.dto";
import {
    AddUserDTO,
    DeleteUserDTO,
    UpdateUserRoleDTO,
} from "../../../infrastructure/driving/dtos/shared/shared.user.dto";

export interface AdminControllerInterfacePort {
    getAllUsers(response: Response, query: GetAllUsersDTO): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
    addUser(body: AddUserDTO, response: Response): Promise<Response>;
    updateRole(
        response: Response,
        userDetails: UpdateUserRoleDTO
    ): Promise<Response>;
    deleteUser(
        response: Response,
        userDetails: DeleteUserDTO
    ): Promise<Response>;
}
