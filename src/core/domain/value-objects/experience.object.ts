/* eslint-disable @typescript-eslint/naming-convention */

export class Experience {
    readonly company: string;

    readonly position: string;

    readonly startDate: Date;

    readonly endDate?: Date;

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

    toJSON() {
        return {
            company: this.company,
            position: this.position,
            startDate: this.startDate,
            endDate: this.endDate,
            description: this.description,
            isCurrent: this.isCurrent(),
        };
    }

    isCurrent(): boolean {
        return !this.endDate;
    }
}
