import {registerAs} from "@nestjs/config";

export interface JwtInterface {
    JWT_TOKEN_KEY: string;
    JWT_REFRESH_TOKEN_KEY: string;
    AES_ENCRYPTION_KEY: string;
}

export const JwtConfig = registerAs(
    "jwt",
    (): JwtInterface => ({
        JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY ?? "default_jwt_token_key",
        JWT_REFRESH_TOKEN_KEY:
            process.env.JWT_REFRESH_TOKEN_KEY ??
            "default_jwt_refresh_token_key",
        AES_ENCRYPTION_KEY:
            process.env.AES_ENCRYPTION_KEY ?? "default_aes_encryption_key",
    })
);
