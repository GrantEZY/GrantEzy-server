import {Module} from "@nestjs/common";
import {EmailQueueService} from "../../../domain/services/queue/email/queue.email.service";

@Module({
    providers: [EmailQueueService],
    exports: [EmailQueueService],
})
export class QueueWorkerServiceModule {}
