import {Cycle} from "../../../core/domain/aggregates/cycle.aggregate";
import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";

export class CreateCycleData {
    programId: string;
    cycleId: string;
}

export class GetProgramCyclesData {
    cycles: Cycle[];
    totalNumberOfCycles: number;
}

export class DeleteCycleData {
    status: boolean;
}

export class UpdateCycleData {
    id: string;
    status: boolean;
}
export class GetCycleDetails {
    cycle: Cycle;
}

export class GetApplicationDetails {
    application: GrantApplication;
}
export class CreateCycleResponse extends ApiResponse(CreateCycleData) {}
export class GetProgramCyclesResponse extends ApiResponse(
    GetProgramCyclesData
) {}
export class DeleteCycleResponse extends ApiResponse(DeleteCycleData) {}
export class UpdateCycleResponse extends ApiResponse(UpdateCycleData) {}
export class GetCycleDetailsResponse extends ApiResponse(GetCycleDetails) {}
export class GetApplicationDetailsResponse extends ApiResponse(
    GetApplicationDetails
) {}
