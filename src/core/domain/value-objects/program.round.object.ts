export class ProgramRound {
    year: number;
    type: string;
    constructor(year: number, type: string) {
        this.year = year;
        this.type = type;
    }

    toJSON() {
        return {
            year: this.year,
            type: this.type,
        };
    }
}
