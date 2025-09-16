import {Cycle} from "../../../core/domain/aggregates/cycle.aggregate";
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

export class CreateCycleResponse extends ApiResponse(CreateCycleData) {}
export class GetProgramCyclesResponse extends ApiResponse(
    GetProgramCyclesData
) {}
export class DeleteCycleResponse extends ApiResponse(DeleteCycleData) {}
