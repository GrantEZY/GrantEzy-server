import {Response} from "express";
import {
    AddUserDTO,
    GetAllUsersDTO,
} from "../../../infrastructure/driving/dtos/admin.dto";

export interface AdminControllerInterfacePort {
    getAllUsers(response: Response, query: GetAllUsersDTO): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
    addUser(body: AddUserDTO, response: Response): Promise<Response>;
}
