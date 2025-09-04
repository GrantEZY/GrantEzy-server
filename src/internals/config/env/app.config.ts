import {registerAs} from "@nestjs/config";

export interface AppConfigTypes {
    PORT: number;
    SERVER_URL: string;
    CLIENT_URL: string;
}

export const AppConfig = registerAs(
    "app",
    (): AppConfigTypes => ({
        PORT: Number(process.env.PORT),
        SERVER_URL: process.env.SERVER_URL ?? "http://localhost:5000",
        CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
    })
);
