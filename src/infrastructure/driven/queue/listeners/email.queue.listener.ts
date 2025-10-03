import {
    QueueEventsListener,
    OnQueueEvent,
    QueueEventsHost,
} from "@nestjs/bullmq";
import {Logger} from "@nestjs/common";

@QueueEventsListener("email-queue")
export class EmailQueueListener extends QueueEventsHost {
    logger = new Logger("EmailQueue");

    @OnQueueEvent("added")
    onAdded(job: {jobId: string; name: string}) {
        this.logger.log(`Job ${job.jobId} has been added to the email queue`);
    }

    @OnQueueEvent("error")
    onError(job: {jobId: string; name: string}) {
        this.logger.log(`Job ${job.jobId} has  faced an to the email queue`);
    }
}
