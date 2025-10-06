import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";
export class CoApplicantApplicationDetails {
    application: GrantApplication;
}

export class TokenVerificationDetails {
    invitedAt: Date;
    application: {
        name: string;
        problem: string;
    };
}

export class CoApplicantApplicationResponse extends ApiResponse(
    CoApplicantApplicationDetails
) {}

export class TokenVerificationResponse extends ApiResponse(
    TokenVerificationDetails
) {}
