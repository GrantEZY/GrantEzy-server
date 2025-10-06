import {Injectable} from "@nestjs/common";
import {SharedApplicationService} from "../shared/application/shared.application.service";
import {TokenVerificationResponse} from "../../../../infrastructure/driven/response-dtos/co.applicant.response-dto";
import ApiError from "../../../../shared/errors/api.error";
@Injectable()
export class ReviewerService {
    constructor(
        private readonly sharedApplicationService: SharedApplicationService
    ) {}

    async getTokenDetails(token: string): Promise<TokenVerificationResponse> {
        try {
            const {application, invite} =
                await this.sharedApplicationService.getTokenDetails(token);

            return {
                status: 200,
                message: "Reviewer Invite Details Fetch",
                res: {
                    invitedAt: invite.createdAt,
                    application: {
                        name: application.basicDetails.title,
                        problem: application.basicDetails.problem,
                    },
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
