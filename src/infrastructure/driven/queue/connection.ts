import {ConfigModule} from "@nestjs/config";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import {BullModule} from "@nestjs/bullmq";
import {EmailQueue} from "./queues/email.queue";
import {CycleInviteQueue} from "./queues/cycle.invite.queue";
import {Global, Module} from "@nestjs/common";
import {EmailQueueListener} from "./listeners/email.queue.listener";
import {CycleInviteQueueListener} from "./listeners/cycle.invite.queue.listener";
import {EmailWorker} from "../../driving/http/workers/email.worker";
import {CycleInviteWorker} from "../../driving/http/workers/cycle.invite.worker";
export const BullConfiguration = BullModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ConfigType>) => {
        const cacheConfig = configService.get("cache");
        const appConfig = configService.get("app");
        return {
            connection: {
                host: cacheConfig?.host ?? "localhost",
                port: cacheConfig?.port ?? 6379,
            },
            prefix: appConfig.APP_NAME,
        };
    },
});

export const QueueFeatureConnection = BullModule.registerQueue(
    {name: "email-queue"},
    {name: "cycle-invite-queue"}
);

@Global()
@Module({
    imports: [ConfigModule, BullConfiguration, QueueFeatureConnection],
    providers: [
        EmailQueue,
        CycleInviteQueue,
        EmailQueueListener,
        CycleInviteQueueListener,
        EmailWorker,
        CycleInviteWorker,
    ],
    exports: [EmailQueue, CycleInviteQueue],
})
export class QueueConnection {}
