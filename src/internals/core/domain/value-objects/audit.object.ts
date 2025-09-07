/* eslint-disable @typescript-eslint/naming-convention */

export class Audit {
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(createdAt?: Date, updatedAt?: Date) {
        const now = new Date();
        this.createdAt = createdAt ?? now;
        this.updatedAt = updatedAt ?? now;
    }

    toJSON() {
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
