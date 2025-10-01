import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";
import ApiError from "../../../../shared/errors/api.error";
import {InviteEmailDTO} from "../../../driving/dtos/queue/email.dto";
import {EmailResponse} from "../../response-dtos/queue/email.response-dto";
import {Logger} from "@nestjs/common";
import {v4 as uuid} from "uuid";
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
            const jobId = `${uniqueId}-${email}`;
            const job = await this.emailQueue.add(jobId, data, {
                removeOnComplete: true,
            });

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
