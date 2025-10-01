import {Processor, OnWorkerEvent} from "@nestjs/bullmq";
import {Injectable, Logger} from "@nestjs/common";
import {Job} from "bullmq";
import {EmailWorkerJobDTO} from "../../dtos/queue/email.dto";
import {QueueWorker} from "../../../../ports/inputs/queue/queue.worker.port";
import {EmailQueueService} from "../../../../core/domain/services/queue/email/queue.email.service";
import ApiError from "../../../../shared/errors/api.error";
@Injectable()
@Processor("email-queue")
export class EmailWorker extends QueueWorker {
    private logger;
    constructor(private readonly emailWorkerService: EmailQueueService) {
        super();
        this.logger = new Logger("EmailWorker");
    }

    async process(job: Job): Promise<void> {
        try {
            const workerData: EmailWorkerJobDTO = job.data;

            await this.emailWorkerService.sendMailService(workerData);
        } catch (error) {
            if (error instanceof ApiError) {
                this.logger.log(`Evaluation error for ${error.message}`);
            }
            this.logger.log(`Evaluation error for ${job.name}`);
        }
    }

    @OnWorkerEvent("failed")
    OnFailed(job: Job) {
        const data: EmailWorkerJobDTO = job.data;

        this.logger.log(
            `Email Worker failed for job ${job.name} and type ${data.type as string}`
        );
    }
}
