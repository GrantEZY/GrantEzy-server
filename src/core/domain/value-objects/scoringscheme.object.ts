/* eslint-disable @typescript-eslint/naming-convention */

export interface ScoringCriteria {
    minScore: number;
    maxScore: number;
    weightage: number;
}
export class ScoringScheme {
    readonly technical: ScoringCriteria;
    readonly market: ScoringCriteria;
    readonly financial: ScoringCriteria;
    readonly team: ScoringCriteria;
    readonly innovation: ScoringCriteria;

    constructor(
        technical: ScoringCriteria,
        market: ScoringCriteria,
        financial: ScoringCriteria,
        team: ScoringCriteria,
        innovation: ScoringCriteria
    ) {
        this.technical = technical;
        this.market = market;
        this.financial = financial;
        this.team = team;
        this.innovation = innovation;
    }

    toJSON() {
        return {
            technical: this.technical,
            market: this.market,
            financial: this.financial,
            team: this.team,
            innovation: this.innovation,
        };
    }
}
