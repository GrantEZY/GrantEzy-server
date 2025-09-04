import {registerAs} from "@nestjs/config";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const TypeOrmConfig = registerAs(
    "typeorm",
    (): TypeOrmModuleOptions => ({
        type: "postgres",
        host: process.env.POSTGRES_HOST ?? "localhost",
        database: process.env.POSTGRES_DB,
        port: Number(process.env.POSTGRES_PORT) || 5432,
        password: process.env.POSTGRES_SECRET,
        username: process.env.POSTGRES_USERNAME,
        synchronize: process.env.POSTGRES_SYNC === "true",
        logging: true,
    })
);
