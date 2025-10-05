import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import {PasswordHasherPort} from "../../../ports/outputs/crypto/hash.port";
import {InviteAs} from "../../../core/domain/constants/invite.constants";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import ApiError from "../../../shared/errors/api.error";
export class BcryptPasswordHasher implements PasswordHasherPort {
    private readonly Algorithm = "aes-256-gcm";

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

    /**
     * Encrypt email + applicationId + role
     */
    encrypt(email: string, applicationId: string, role: InviteAs): string {
        const iv = crypto.randomBytes(16); // initialization vector
        const cipher = crypto.createCipheriv(
            this.Algorithm,
            this.configService.get("app").ENCRYPTION_KEY,
            iv
        );

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
            const data = Buffer.from(encryptedText, "base64");

            const iv = data.subarray(0, 16);
            const authTag = data.subarray(16, 32);
            const encrypted = data.subarray(32);

            const decipher = crypto.createDecipheriv(
                this.Algorithm,
                this.configService.get("app").ENCRYPTION_KEY,
                iv
            );
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
