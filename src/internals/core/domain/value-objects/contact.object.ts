/* eslint-disable @typescript-eslint/naming-convention */

import {Column} from "typeorm";

export class Contact {
    @Column()
    readonly email: string;

    @Column()
    readonly phone: string | null;

    @Column()
    readonly address: string | null;

    constructor(email: string, phone: string | null, address: string | null) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Invalid email address");
        }
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}
