import {
    GCVMemberAddDTO,
    GetAllGCVUsersDTO,
    UpdateGCVUserRoleDTO,
} from "../../../infrastructure/driving/dtos/gcv.dto";
import {Response} from "express";

export interface GCVControllerPort {
    getAllMembers(
        response: Response,
        query: GetAllGCVUsersDTO
    ): Promise<Response>;

    addGcvMembers(body: GCVMemberAddDTO, response: Response): Promise<Response>;
    updateGCVMemberRole(
        body: UpdateGCVUserRoleDTO,
        response: Response
    ): Promise<Response>;

    handleError(error: unknown, response: Response): Response;
}
