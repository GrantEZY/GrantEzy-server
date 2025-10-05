import {Processor, OnWorkerEvent} from "@nestjs/bullmq";
import {Injectable, Logger} from "@nestjs/common";
import {Job} from "bullmq";
import {QueueWorker} from "../../../../ports/inputs/queue/queue.worker.port";
import ApiError from "../../../../shared/errors/api.error";
import {CycleInviteQueueService} from "../../../../core/domain/services/queue/cycle-invite/cycle.invite.queue.service";
import {CycleInviteDTO} from "../../dtos/queue/queue.dto";

@Injectable()
@Processor("cycle-invite-queue")
export class CycleInviteWorker extends QueueWorker {
    private logger;

    constructor(private readonly cycleInviteService: CycleInviteQueueService) {
        super();
        this.logger = new Logger("EmailWorker");
    }

    async process(job: Job): Promise<void> {
        try {
            const data: CycleInviteDTO = job.data;

            await this.cycleInviteService.inviteCycleMembers(data);
        } catch (error) {
            if (error instanceof ApiError) {
                this.logger.log(`Cycle Invite error for ${error.message}`);
            }
            this.logger.log(`Cycle Invite error for ${job.name}`);
        }
    }

    @OnWorkerEvent("failed")
    OnFailed(job: Job) {
        this.logger.log(`Cycle Invite failed for job ${job.name} }`);
    }
}
