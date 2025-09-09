import {registerAs} from "@nestjs/config";

export interface CacheInterface {
    redisUrl: string;
    host: string;
    port: number;
}

export const CacheConfig = registerAs(
    "cache",
    (): CacheInterface => ({
        redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
        host: process.env.REDIS_HOST ?? "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
    })
);
