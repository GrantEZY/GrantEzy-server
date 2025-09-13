export class Duration {
    startDate: Date;
    endDate: Date | null;

    constructor(startDate: Date, endDate: Date | null) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    toJSON() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
        };
    }
}
