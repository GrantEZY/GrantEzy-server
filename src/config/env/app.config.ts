import {registerAs} from "@nestjs/config";

export interface AppConfigTypes {
    PORT: number;
    SERVER_URL: string;
    CLIENT_URL: string;
    NODE_ENV: string;
    APP_NAME: string;
    RESEND_API: string;
    APP_EMAIL: string;
    ENCRYPTION_KEY: string;
}

export const AppConfig = registerAs(
    "app",
    (): AppConfigTypes => ({
        PORT: Number(process.env.PORT),
        SERVER_URL: process.env.SERVER_URL ?? "http://localhost:5000",
        CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
        NODE_ENV: process.env.NODE_ENV ?? "development",
        APP_NAME: process.env.APP_NAME ?? "NestJS Application",
        RESEND_API: process.env.RESEND_API ?? "",
        APP_EMAIL: process.env.APP_EMAIL ?? "",
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? "",
    })
);
