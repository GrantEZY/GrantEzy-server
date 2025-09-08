/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*  eslint-disable @typescript-eslint/no-unsafe-call */

import * as Joi from "joi";

export const environmentValidationSchema = Joi.object({
    POSTGRES_SECRET: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_USERNAME: Joi.string().required(),
    POSTGRES_SYNC: Joi.boolean().default(false),
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string()
        .valid("development", "production")
        .default("development"),
    POSTGRES_HOST: Joi.string().default("localhost"),
    POSTGRES_PORT: Joi.number().default(5432),
    JWT_TOKEN_KEY: Joi.string().required(),
    JWT_REFRESH_TOKEN_KEY: Joi.string().required(),
    AES_ENCRYPTION_KEY: Joi.string().required(),
}).unknown(true);
