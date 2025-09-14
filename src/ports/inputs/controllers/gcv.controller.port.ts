import {
    GCVMemberAddDTO,
    GetAllGCVUsersDTO,
    UpdateGCVUserRoleDTO,
} from "../../../infrastructure/driving/dtos/gcv.dto";
import {Response} from "express";
import {CreateProgramDTO} from "../../../infrastructure/driving/dtos/gcv.dto";

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
    createProgram(
        body: CreateProgramDTO,
        response: Response
    ): Promise<Response>;

    handleError(error: unknown, response: Response): Response;
}
