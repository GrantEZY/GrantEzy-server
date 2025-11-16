import {Cycle} from "../../../core/domain/aggregates/cycle.aggregate";
import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {Program} from "../../../core/domain/aggregates/program.aggregate";
import {ApplicationReviewAggregate} from "../../../core/domain/aggregates/application.review.aggregate";
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

export class CreateReviewInvite {
    email: string;
    applicationId: string;
}

export class GetApplicationReviews {
    application: GrantApplication;
    reviews: ApplicationReviewAggregate[];
}

export class GetReviewDetails {
    review: ApplicationReviewAggregate;
}

export class ProgramManagerProgram {
    program: Program;
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
export class CreateReviewInviteResponse extends ApiResponse(
    CreateReviewInvite
) {}
export class GetApplicationReviewsResponse extends ApiResponse(
    GetApplicationReviews
) {}
export class GetReviewDetailsResponse extends ApiResponse(GetReviewDetails) {}

export class ProgramManagerDetailsResponse extends ApiResponse(
    ProgramManagerProgram
) {}
