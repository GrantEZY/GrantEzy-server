import {
    AddProgramManagerDTO,
    DeleteProgramDTO,
    GCVMemberAddDTO,
    GetAllGCVUsersDTO,
    UpdateGCVUserRoleDTO,
    UpdateProgramManagerDTO,
} from "../../../infrastructure/driving/dtos/gcv.dto";
import {Response} from "express";
import {CreateProgramDTO} from "../../../infrastructure/driving/dtos/gcv.dto";
import {
    GetAllProgramDTO,
    UpdateProgramDTO,
} from "../../../infrastructure/driving/dtos/shared/shared.program.dto";

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

    getAllPrograms(
        query: GetAllProgramDTO,
        response: Response
    ): Promise<Response>;

    updateProgram(
        body: UpdateProgramDTO,
        response: Response
    ): Promise<Response>;

    deleteProgram(
        body: DeleteProgramDTO,
        response: Response
    ): Promise<Response>;

    addProgramManager(
        body: AddProgramManagerDTO,
        response: Response
    ): Promise<Response>;

    updateProgramManager(
        body: UpdateProgramManagerDTO,
        response: Response
    ): Promise<Response>;

    handleError(error: unknown, response: Response): Response;
}
