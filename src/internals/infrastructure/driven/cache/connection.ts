/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {CacheModule} from "@nestjs/cache-manager";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import {createKeyv} from "@keyv/redis";
import {Keyv} from "keyv";
import {CacheableMemory} from "cacheable";

export const CacheConnection = CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ConfigType>) => {
        const redisConfig = configService.get("cache");
        return {
            stores: [
                new Keyv({
                    store: new CacheableMemory({ttl: 60000, lruSize: 5000}),
                }),
                createKeyv(redisConfig.redisUrl as string),
            ],
        };
    },
});
