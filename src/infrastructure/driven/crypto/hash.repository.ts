import * as bcrypt from "bcrypt";
import {PasswordHasherPort} from "../../../ports/outputs/crypto/hash.port";
import {Injectable} from "@nestjs/common";
import crypto from "crypto";
@Injectable()
export class BcryptPasswordHasher implements PasswordHasherPort {
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
}
