/* eslint-disable @typescript-eslint/naming-convention */

export class Contact {
    readonly email: string;

    readonly phone: string | null;

    readonly address: string | null;

    constructor(email: string, phone: string | null, address: string | null) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Invalid email address");
        }
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    toJSON() {
        return {
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }
}
