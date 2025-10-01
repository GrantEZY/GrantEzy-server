import {ConfigModule} from "@nestjs/config";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import {BullModule} from "@nestjs/bullmq";
import {QueueWorkerServiceModule} from "../../../core/application/others/queue-worker-module/queueWorkerServiceModule";
import {EmailQueue} from "./queues/email.queue";
import {Global, Module} from "@nestjs/common";
import {EmailQueueListener} from "./listeners/email.queue.listener";
export const BullConfiguration = BullModule.forRootAsync({
    imports: [ConfigModule, QueueWorkerServiceModule],
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

export const QueueFeatureConnection = BullModule.registerQueue({
    name: "email-queue",
});

@Global()
@Module({
    imports: [
        ConfigModule,
        QueueWorkerServiceModule,
        BullConfiguration,
        QueueFeatureConnection,
        EmailQueueListener,
    ],
    providers: [EmailQueue],
    exports: [EmailQueue],
})
export class QueueConnection {}
