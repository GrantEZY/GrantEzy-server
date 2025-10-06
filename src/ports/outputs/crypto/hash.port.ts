export interface PasswordHasherPort {
    hash(plain: string): Promise<string>;

    compare(plain: string, hash: string): Promise<boolean>;

    generateToken(): Promise<{token: string; hash: string}>;
}

export const PASSWORD_HASHER_PORT = Symbol("PasswordHasherPort");
