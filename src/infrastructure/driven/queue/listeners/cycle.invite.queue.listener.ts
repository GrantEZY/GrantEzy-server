import {
    QueueEventsListener,
    OnQueueEvent,
    QueueEventsHost,
} from "@nestjs/bullmq";
import {Logger} from "@nestjs/common";

@QueueEventsListener("cycle-invite-queue")
export class CycleInviteQueueListener extends QueueEventsHost {
    logger = new Logger("CycleInviteQueue");

    @OnQueueEvent("added")
    onAdded(job: {jobId: string; name: string}) {
        this.logger.log(
            `Job ${job.jobId} has been added to the cycle Invite queue`
        );
    }
    @OnQueueEvent("error")
    onError(job: {jobId: string; name: string}) {
        this.logger.log(`Job ${job.jobId} has faced an cycle Invite queue`);
    }
}
