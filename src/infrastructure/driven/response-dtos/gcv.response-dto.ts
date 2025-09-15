import {ApiResponse} from "../../../shared/types/response.type";
import {User} from "../../../core/domain/aggregates/user.aggregate";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
import {ProgramStatus} from "../../../core/domain/constants/status.constants";
import {Program} from "../../../core/domain/aggregates/program.aggregate";
class AddUserResponseData {
    id: string;
    email: string;
}

class GetUsersData {
    users: User[];
    totalNumberOfUsers: number;
}

class UpdateUserResponseData {
    id: string;
    role: UserRoles;
}
class CreateProgramData {
    organizationId: string;
    name: string;
    id: string;
}

class UpdateProgramData {
    id: string;
    status: ProgramStatus;
}
class DeleteProgramData {
    success: boolean;
}

class AddProgramManagerData {
    managerId: string;
    programId: string;
}

class GetProgramsData {
    programs: Program[];
    numberOfPrograms: number;
}

class UpdateProgramManagerData {
    managerId: string;
    programId: string;
}
export class UpdateUserDataResponse extends ApiResponse(
    UpdateUserResponseData
) {}

export class GetGCVUsersDataResponse extends ApiResponse(GetUsersData) {}
export class AddGCVUserDataResponse extends ApiResponse(AddUserResponseData) {}
export class CreateProgramResponse extends ApiResponse(CreateProgramData) {}
export class GetAllProgramsResponse extends ApiResponse(GetProgramsData) {}
export class UpdateProgramResponse extends ApiResponse(UpdateProgramData) {}
export class DeletProgramResponse extends ApiResponse(DeleteProgramData) {}
export class AddProgramManagerResponse extends ApiResponse(
    AddProgramManagerData
) {}
export class UpdateProgramManagerResponse extends ApiResponse(
    UpdateProgramManagerData
) {}
