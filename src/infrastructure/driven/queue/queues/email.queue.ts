import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";
import ApiError from "../../../../shared/errors/api.error";
import {
    CycleInviteDTO,
    ForgotPasswordEmailDTO,
    InviteEmailDTO,
} from "../../../driving/dtos/queue/queue.dto";
import {EmailResponse} from "../../response-dtos/queue/queue.response-dto";
import {Logger} from "@nestjs/common";
import {v4 as uuid} from "uuid";
import {EmailNotifications} from "../../../../core/domain/constants/notification.constants";
import {User} from "../../../../core/domain/aggregates/user.aggregate";
import {GrantApplication} from "../../../../core/domain/aggregates/grantapplication.aggregate";
@Injectable()
export class EmailQueue {
    private logger;
    constructor(
        @InjectQueue("email-queue")
        private readonly emailQueue: Queue
    ) {
        this.logger = new Logger("EmailQueue");
    }

    async addInviteEmailToQueue(
        email: string,
        data: InviteEmailDTO
    ): Promise<EmailResponse> {
        try {
            const uniqueId = uuid();
            const jobId = `${uniqueId}-${email}-application-invite`;
            const job = await this.emailQueue.add(
                jobId,
                {type: EmailNotifications.INVITE_USER, data},
                {
                    removeOnComplete: true,
                }
            );

            return {
                status: true,
                queue: {
                    name: job.name,
                },
            };
        } catch (error) {
            this.logger.log(`Error in Adding to Invite Email Queue`);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Issue In Sending Email",
                "Email Queue Error"
            );
        }
    }

    async addCycleInviteEmailToQueue(
        email: string,
        data: CycleInviteDTO
    ): Promise<EmailResponse> {
        try {
            const uniqueId = uuid();
            const jobId = `${uniqueId}-${email}-cycle-invite`;
            const job = await this.emailQueue.add(
                jobId,
                {type: EmailNotifications.CYCLE_INVITE_REQUEST, data},
                {
                    removeOnComplete: true,
                }
            );

            return {
                status: true,
                queue: {
                    name: job.name,
                },
            };
        } catch (error) {
            this.logger.log(`Error in Adding to Invite Email Queue`);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Issue In Sending Email",
                "Email Queue Error"
            );
        }
    }

    async addReviewerInviteEmailToQueue(
        email: string,
        data: CycleInviteDTO
    ): Promise<EmailResponse> {
        try {
            const uniqueId = uuid();
            const jobId = `${uniqueId}-${email}-reviewer-invite`;
            const job = await this.emailQueue.add(
                jobId,
                {type: EmailNotifications.REVIEWER_INVITE_REQUEST, data},
                {
                    removeOnComplete: true,
                }
            );

            return {
                status: true,
                queue: {
                    name: job.name,
                },
            };
        } catch (error) {
            this.logger.log(`Error in Adding to Reviewer Invite Email Queue`);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Issue In Sending Email",
                "Email Queue Error"
            );
        }
    }

    async addProjectReviewerInviteEmailToQueue(
        email: string,
        data: CycleInviteDTO
    ): Promise<EmailResponse> {
        try {
            const uniqueId = uuid();
            const jobId = `${uniqueId}-${email}-project-assessment-reviewer-invite`;
            const job = await this.emailQueue.add(
                jobId,
                {
                    type: EmailNotifications.PROJECT_ASSESSMENT_REVIEWER_INVITE,
                    data,
                },
                {
                    removeOnComplete: true,
                }
            );

            return {
                status: true,
                queue: {
                    name: job.name,
                },
            };
        } catch (error) {
            this.logger.log(`Error in Adding to Reviewer Invite Email Queue`);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Issue In Sending Email",
                "Email Queue Error"
            );
        }
    }

    async addForgotPasswordEmailToQueue(
        email: string,
        data: ForgotPasswordEmailDTO
    ): Promise<EmailResponse> {
        try {
            const uniqueId = uuid();
            const jobId = `${uniqueId}-${email}-forgot-password-request`;
            const job = await this.emailQueue.add(
                jobId,
                {type: EmailNotifications.FORGOT_PASSWORD, data},
                {
                    removeOnComplete: true,
                }
            );

            return {
                status: true,
                queue: {
                    name: job.name,
                },
            };
        } catch (error) {
            this.logger.log(`Error in Adding to Forgot Password Email Queue`);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Issue In Sending Email",
                "Email Queue Error"
            );
        }
    }

    async createProjectEmailToQueue(
        userDatas: User[],
        applicationName: string
    ): Promise<EmailResponse> {
        try {
            const jobs = userDatas.map((data) => {
                const uniqueId = uuid();
                const {email} = data.contact;
                const {firstName, lastName} = data.person;

                const jobId =
                    uniqueId + "-" + email + "-create-project-confirmation"; // eslint-disable-line
                return {
                    name: jobId,
                    data: {
                        type: EmailNotifications.PROJECT_CREATED,
                        data: {
                            applicationName,
                            email,
                            userName: `${firstName} ${lastName}`,
                        },
                    },
                };
            });
            const addedJobs = await this.emailQueue.addBulk(jobs);

            return {
                status: true,
                queue: {
                    name: "Jobs Added Successfully " + String(addedJobs.length),
                },
            };
        } catch (error) {
            this.logger.log(`Error in Adding to Create Project Email Queue`);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Issue In Sending Email",
                "Email Queue Error"
            );
        }
    }

    async cycleReviewToQueue(
        projectApplications: GrantApplication[],
        cycleReviewName: string,
        reviewBrief: string
    ): Promise<EmailResponse> {
        try {
            if (!projectApplications?.length) {
                throw new ApiError(
                    400,
                    "No project applications provided",
                    "Empty Data"
                );
            }

            const allJobs = projectApplications.flatMap((project) => {
                const projectAuthorities = [
                    project.applicant,
                    ...project.teammates,
                ];
                const uniqueId = uuid();

                return projectAuthorities.map((user) => {
                    const {email} = user.contact;
                    const {firstName, lastName} = user.person;
                    const jobId = `${uniqueId}-${email}-create-new-review-confirmation`;

                    return {
                        name: jobId,
                        data: {
                            type: EmailNotifications.CYCLE_REVIEW_CREATED,
                            data: {
                                cycleReviewName,
                                reviewBrief,
                                userName: `${firstName} ${lastName}`,
                                applicationName: project.basicDetails.title,
                                email,
                            },
                        },
                    };
                });
            });

            await this.emailQueue.addBulk(allJobs);

            return {
                status: true,
                queue: {
                    name:
                        `Jobs Added Successfully for Cycle Review Creation}` +
                        String(projectApplications.length),
                },
            };
        } catch (error) {
            this.logger.error(`Error in adding jobs for cycleReview`);
            if (error instanceof ApiError) throw error;
            throw new ApiError(
                500,
                "Issue In Sending Email",
                "Email Queue Error"
            );
        }
    }

    async pauseQueue() {
        try {
            await this.emailQueue.pause();
            return {message: "Queue paused successfully"};
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error pausing queue", "Queue Pause Error");
        }
    }

    async resumeQueue() {
        try {
            await this.emailQueue.resume();
            return {message: "Queue resumed successfully"};
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Error resuming queue",
                "Queue Resume Error"
            );
        }
    }

    async clearQueue() {
        try {
            await this.emailQueue.drain();
            return {message: "Queue cleared successfully"};
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Error clearing queue",
                "Queue Clear Error"
            );
        }
    }
}
