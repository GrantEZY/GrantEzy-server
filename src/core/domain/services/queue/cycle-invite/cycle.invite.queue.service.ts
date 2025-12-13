import {Inject, Injectable} from "@nestjs/common";
import ApiError from "../../../../../shared/errors/api.error";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/user/user.aggregate.port";
import {CycleInviteDTO} from "../../../../../infrastructure/driving/dtos/queue/queue.dto";
import {UserSharedService} from "../../shared/user/shared.user.service";
import {UpdateRole} from "../../../../../infrastructure/driving/dtos/shared/shared.user.dto";
import {EmailQueue} from "../../../../../infrastructure/driven/queue/queues/email.queue";
import {User} from "../../../aggregates/user.aggregate";
import {UserRoles} from "../../../constants/userRoles.constants";
import {InviteAs} from "../../../constants/invite.constants";
@Injectable()
export class CycleInviteQueueService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        private readonly userSharedService: UserSharedService,
        private readonly emailQueue: EmailQueue
    ) {}

    async inviteCycleMembers(userDetails: CycleInviteDTO): Promise<boolean> {
        try {
            const {email, role} = userDetails;
            let invitedUser: User | null;

            const user = await this.userAggregateRepository.findByEmail(
                email,
                false
            );

            if (!user) {
                const {res} = await this.userSharedService.addUser({
                    email,
                    role,
                });

                // TODO   Logic need to be modified
                invitedUser = await this.userAggregateRepository.findByEmail(
                    res?.email as string, // eslint-disable-line
                    false
                );

                if (!invitedUser) {
                    throw new ApiError(
                        403,
                        "User addition conflict",
                        "User Error"
                    );
                }
            } else {
                invitedUser = user;
                const {role: UserRoles} = user;
                if (!UserRoles.includes(role)) {
                    await this.userSharedService.updateUserRole(
                        {email, role, type: UpdateRole.ADD_ROLE},
                        user
                    );
                }
            }

            let emailStatus;

            if (userDetails.role === UserRoles.REVIEWER) {
                if (userDetails.inviteAs === InviteAs.REVIEWER) {
                    emailStatus =
                        await this.emailQueue.addReviewerInviteEmailToQueue(
                            email,
                            userDetails
                        );
                } else {
                    emailStatus =
                        await this.emailQueue.addProjectReviewerInviteEmailToQueue(
                            email,
                            userDetails
                        );
                }
            } else {
                emailStatus = await this.emailQueue.addCycleInviteEmailToQueue(
                    email,
                    userDetails
                );
            }

            if (!emailStatus.status) {
                throw new ApiError(
                    403,
                    "Email  Invite Error conflict",
                    "Email Sending Error"
                );
            }

            return true;
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
