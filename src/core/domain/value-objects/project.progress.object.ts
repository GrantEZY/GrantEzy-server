/* eslint-disable @typescript-eslint/naming-convention */

export class ProjectProgress {
    readonly currentPhase: string;
    readonly completionRate: number;
    readonly lastUpdated: Date;
    readonly notes: string;

    constructor(
        currentPhase: string,
        completionRate: number,
        lastUpdated: Date,
        notes: string
    ) {
        this.currentPhase = currentPhase;
        this.completionRate = completionRate;
        this.lastUpdated = lastUpdated;
        this.notes = notes;
    }

    toJSON() {
        return {
            currentPhase: this.currentPhase,
            completionRate: this.completionRate,
            lastUpdated: this.lastUpdated,
            notes: this.notes,
        };
    }
}
