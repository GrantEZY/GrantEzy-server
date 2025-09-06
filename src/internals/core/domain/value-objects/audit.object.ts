/* eslint-disable @typescript-eslint/naming-convention */

import {CreateDateColumn, UpdateDateColumn} from "typeorm";

export class Audit {
    @CreateDateColumn()
    readonly createdAt: Date;

    @UpdateDateColumn()
    readonly updatedAt: Date;
}
