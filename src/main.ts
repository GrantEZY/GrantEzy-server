/**
 * Main entry point of the application.
 * Sets up and starts the NestJS server with necessary middleware and configurations.
 * @file src/main.ts
 */

import {NestFactory, Reflector} from "@nestjs/core";

import {config as SwaggerConfig} from "./config/swagger/setup";
import {SwaggerModule} from "@nestjs/swagger";

import {AppModule} from "./core/application/app.module";

import helmet from "helmet";
import cookieParser from "cookie-parser";
import {ValidationPipe} from "@nestjs/common";
import {AtGuard} from "./shared/guards/at.guard";

async function initServer() {
    const app = await NestFactory.create(AppModule);

    //setting up accessToken guard
    const reflector = new Reflector();
    app.useGlobalGuards(new AtGuard(reflector));
    app.enableShutdownHooks();
    app.use(helmet());
    app.use(cookieParser());

    //Enable global for DTO's
    app.useGlobalPipes(new ValidationPipe());

    app.setGlobalPrefix("api/v1"); // Set v1 API prefix for all the routes

    //swagger setup for api documentation
    const document = SwaggerModule.createDocument(app, SwaggerConfig);
    SwaggerModule.setup("api/v1/docs", app, document);

    //cors setup
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
