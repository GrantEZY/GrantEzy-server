import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";
import ApiError from "../../../../shared/errors/api.error";
import {Logger} from "@nestjs/common";
import {CycleInviteDTO} from "../../../driving/dtos/queue/queue.dto";
import {v4 as uuid} from "uuid";
import {CycleInviteResponse} from "../../response-dtos/queue/queue.response-dto";
@Injectable()
export class CycleInviteQueue {
    private logger;
    constructor(
        @InjectQueue("cycle-invite-queue")
        private readonly cycleInviteQueue: Queue
    ) {
        this.logger = new Logger("CycleInviteQueue");
    }

    async UserCycleInvite(data: CycleInviteDTO): Promise<CycleInviteResponse> {
        try {
            const {email, role} = data;
            const uniqueId = uuid();
            const jobId = `${uniqueId}-${email}`;
            const job = await this.cycleInviteQueue.add(jobId, data, {
                removeOnComplete: true,
            });

            return {
                status: true,
                email,
                role,
                queue: {
                    name: job.name,
                },
            };
        } catch (error) {
            this.logger.log(`Error in Adding to Cycle Invite Queue`);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                "Issue In Sending Invite",
                "Cycle Invite Queue Error"
            );
        }
    }

    async pauseQueue() {
        try {
            await this.cycleInviteQueue.pause();
            return {message: "Cycle Invite Queue paused successfully"};
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error pausing queue", "Queue Pause Error");
        }
    }

    async resumeQueue() {
        try {
            await this.cycleInviteQueue.resume();
            return {message: "Cycle Invite Queue resumed successfully"};
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
            await this.cycleInviteQueue.drain();
            return {message: "Cycle Invite Queue cleared successfully"};
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
