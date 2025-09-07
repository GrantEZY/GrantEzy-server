import * as bcrypt from "bcrypt";
import {PasswordHasherPort} from "../../../core/ports/outputs/crypto/hash.port";

export class BcryptPasswordHasher implements PasswordHasherPort {
    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, 12);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
