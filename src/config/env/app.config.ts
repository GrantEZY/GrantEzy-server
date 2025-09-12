import {registerAs} from "@nestjs/config";

export interface AppConfigTypes {
    PORT: number;
    SERVER_URL: string;
    CLIENT_URL: string;
    NODE_ENV: string;
    APP_NAME: string;
}

export const AppConfig = registerAs(
    "app",
    (): AppConfigTypes => ({
        PORT: Number(process.env.PORT),
        SERVER_URL: process.env.SERVER_URL ?? "http://localhost:5000",
        CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
        NODE_ENV: process.env.NODE_ENV ?? "development",
        APP_NAME: process.env.APP_NAME ?? "NestJS Application",
    })
);
