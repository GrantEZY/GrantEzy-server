import {InviteAs} from "../../../core/domain/constants/invite.constants";

export interface PasswordHasherPort {
    /**
     * Hash a plain password string
     */
    hash(plain: string): Promise<string>;

    /**
     * Compare plain password with hashed value
     */
    compare(plain: string, hash: string): Promise<boolean>;

    /**
     * Encrypt sensitive details (email, applicationId, role)
     */
    encrypt(email: string, applicationId: string, role: InviteAs): string;

    /**
     * Decrypt encrypted string back into original details
     */
    decrypt(encryptedText: string): {
        email: string;
        applicationId: string;
        role: InviteAs;
    };
}

export const PASSWORD_HASHER_PORT = Symbol("PasswordHasherPort");
