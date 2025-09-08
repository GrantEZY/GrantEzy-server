import * as bcrypt from "bcrypt";
import {PasswordHasherPort} from "../../../ports/outputs/crypto/hash.port";

export class BcryptPasswordHasher implements PasswordHasherPort {
    /**
     *
     * @param plain plain password of the user
     * @returns hashed password for the user
     */
    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, 12);
    }

    /**
     *
     * @param plain plain password
     * @param hash hash password from db
     * @returns true if same , false if not same
     */
    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
