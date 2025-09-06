/* eslint-disable @typescript-eslint/naming-convention */

import {Column} from "typeorm";

export class Experience {
    @Column()
    readonly company: string;

    @Column()
    readonly position: string;

    @Column({type: "date"})
    readonly startDate: Date;

    @Column({type: "date", nullable: true})
    readonly endDate?: Date;

    @Column({type: "text"})
    readonly description: string;

    constructor(
        company: string,
        position: string,
        startDate: Date,
        description: string,
        endDate?: Date
    ) {
        if (!company || !position) {
            throw new Error("Company and Position are required");
        }
        if (endDate && endDate < startDate) {
            throw new Error("End date cannot be before start date");
        }

        this.company = company;
        this.position = position;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
    }
}
