import {registerAs} from "@nestjs/config";
import {TypeOrmModuleOptions as DataBaseConfig} from "@nestjs/typeorm";

export const DatabaseConfig = registerAs(
    "database",
    (): DataBaseConfig => ({
        type: "postgres",
        host: process.env.POSTGRES_HOST ?? "localhost",
        database: process.env.POSTGRES_DB,
        port: Number(process.env.POSTGRES_PORT) || 5432,
        password: process.env.POSTGRES_SECRET,
        username: process.env.POSTGRES_USERNAME,
        synchronize: process.env.POSTGRES_SYNC === "true",
        url: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL_REQUIRED === "true",
        logging: true,
    })
);
