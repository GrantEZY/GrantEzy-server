/**
 * Main entry point of the application.
 * Sets up and starts the NestJS server with necessary middleware and configurations.
 * @file src/main.ts
 */

import {NestFactory} from "@nestjs/core";

import {AppModule} from "./app.module";

import helmet from "helmet";
import cookieParser from "cookie-parser";

async function initServer() {
    const app = await NestFactory.create(AppModule);
    app.enableShutdownHooks();
    app.use(helmet());
    app.use(cookieParser());

    app.setGlobalPrefix("api/v1"); // Set v1 API prefix for all the routes
    app.enableCors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders:
            "Content-Type, Accept, Authorization, X-Requested-With ,Event-Id, X-Csrf-Token",
    });

    await app.listen(process.env.PORT ?? 3000);
}
initServer();
