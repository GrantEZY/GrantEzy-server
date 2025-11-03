import {Cycle} from "../../../core/domain/aggregates/cycle.aggregate";
import {Program} from "../../../core/domain/aggregates/program.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";

export class GetActiveProgramsData {
    programs: Program[];
}

export class GetActiveProgramCycleDetails {
    program: Program;
    cycles: Cycle[];
}

export class GetActiveProgramsResponse extends ApiResponse(
    GetActiveProgramsData
) {}

export class GetActiveProgramCycleDetailsResponse extends ApiResponse(
    GetActiveProgramCycleDetails
) {}
