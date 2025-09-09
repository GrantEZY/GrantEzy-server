import {Response} from "express";
import {GetAllUsersDTO} from "../../../infrastructure/driving/dtos/admin.dto";

export interface AdminControllerInterfacePort {
    getAllUsers(response: Response, query: GetAllUsersDTO): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
