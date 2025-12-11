import * as bcrypt from "bcrypt";
import {PasswordHasherPort} from "../../../ports/outputs/crypto/hash.port";
import {Injectable} from "@nestjs/common";
import crypto from "crypto";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import ApiError from "../../../shared/errors/api.error";
@Injectable()
export class BcryptPasswordHasher implements PasswordHasherPort {
    constructor(private readonly configService: ConfigService<ConfigType>) {}
    /**
     * Hash password with bcrypt
     */
    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, 12);
    }

    /**
     * Compare plain vs hash
     */
    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    async generateToken(): Promise<{token: string; hash: string}> {
        const token = crypto.randomBytes(32).toString("hex");

        const hash = await this.hash(token);

        return {
            token,
            hash,
        };
    }

    encrypt(text: string): string {
        const algorithm = "aes-256-cbc";
        const keyHex = this.configService.get("app").ENCRYPTION_KEY;

        if (!keyHex || keyHex.length !== 64) {
            throw new ApiError(
                500,
                "Invalid AES key length. Must be 64 hex chars (32 bytes).",
                "Encryption Error"
            );
        }

        const key = Buffer.from(keyHex, "hex");
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, "utf8"),
            cipher.final(),
        ]);

        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }

    decrypt(encryptedText: string): string {
        const algorithm = "aes-256-cbc";
        const keyHex = this.configService.get("app").ENCRYPTION_KEY;

        if (!keyHex || keyHex.length !== 64) {
            throw new ApiError(
                500,
                "Invalid AES key length. Must be 64 hex chars (32 bytes).",
                "Decryption Error"
            );
        }

        const key = Buffer.from(keyHex, "hex");

        const [ivHex, encryptedHex] = encryptedText.split(":");
        if (!ivHex || !encryptedHex) {
            throw new Error(
                "Invalid encrypted text format. Must be 'iv:encrypted'"
            );
        }

        const iv = Buffer.from(ivHex, "hex");
        const encrypted = Buffer.from(encryptedHex, "hex");

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);

        return decrypted.toString("utf8");
    }
}
