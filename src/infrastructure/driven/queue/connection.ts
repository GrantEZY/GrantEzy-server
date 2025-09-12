import {ConfigModule} from "@nestjs/config";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import {BullModule} from "@nestjs/bullmq";

export const QueueConnection = BullModule.forRootAsync({
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

export const QueueFeatureConnection = BullModule.registerQueue({
    name: "email-queue",
});
