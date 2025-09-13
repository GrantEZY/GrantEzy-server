/* eslint-disable @typescript-eslint/naming-convention */

export class TRLCriteria {
    readonly requirements: string[];
    readonly evidence: string[];
    readonly metrics: string[];

    constructor(requirements: string[], evidence: string[], metrics: string[]) {
        this.requirements = requirements;
        this.evidence = evidence;
        this.metrics = metrics;
    }

    toJSON() {
        return {
            requirements: this.requirements,
            evidence: this.evidence,
            metrics: this.metrics,
        };
    }
}
