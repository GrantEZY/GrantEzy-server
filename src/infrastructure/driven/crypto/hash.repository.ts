import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import {PasswordHasherPort} from "../../../ports/outputs/crypto/hash.port";
import {InviteAs} from "../../../core/domain/constants/invite.constants";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import ApiError from "../../../shared/errors/api.error";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BcryptPasswordHasher implements PasswordHasherPort {
    private readonly Algorithm = "aes-256-gcm";

    constructor(private readonly configService: ConfigService<ConfigType>) {}

    private getKey(): Buffer {
        const secret = this.configService.get("app").ENCRYPTION_KEY;
        if (!secret) {
            throw new Error("ENCRYPTION_KEY is not configured");
        }

        // Ensure the key is always 32 bytes long (required by aes-256-gcm)
        return crypto.createHash("sha256").update(secret).digest();
    }

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

    /**
     * Encrypt email + applicationId + role
     */
    encrypt(email: string, applicationId: string, role: InviteAs): string {
        const key = this.getKey();
        const iv = crypto.randomBytes(12); // recommended length for GCM
        const cipher = crypto.createCipheriv(this.Algorithm, key, iv);

        const payload = JSON.stringify({email, applicationId, role});

        const encrypted = Buffer.concat([
            cipher.update(payload, "utf8"),
            cipher.final(),
        ]);

        const authTag = cipher.getAuthTag();

        // return iv + authTag + encrypted, base64 encoded
        return Buffer.concat([iv, authTag, encrypted]).toString("base64");
    }

    /**
     * Decrypt encrypted string back to details
     */
    decrypt(encryptedText: string): {
        email: string;
        applicationId: string;
        role: InviteAs;
    } {
        try {
            const key = this.getKey();
            const data = Buffer.from(encryptedText, "base64");

            const iv = data.subarray(0, 12); // first 12 bytes
            const authTag = data.subarray(12, 28); // next 16 bytes
            const encrypted = data.subarray(28); // rest

            const decipher = crypto.createDecipheriv(this.Algorithm, key, iv);
            decipher.setAuthTag(authTag);

            const decrypted = Buffer.concat([
                decipher.update(encrypted),
                decipher.final(),
            ]).toString("utf8");

            return JSON.parse(decrypted); // eslint-disable-line
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(403, "Token was modified", "Token error");
        }
    }
}
