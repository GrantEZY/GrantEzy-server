import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";
export class CoApplicantApplicationDetails {
    application: GrantApplication;
}

export class CoApplicantApplicationResponse extends ApiResponse(
    CoApplicantApplicationDetails
) {}
