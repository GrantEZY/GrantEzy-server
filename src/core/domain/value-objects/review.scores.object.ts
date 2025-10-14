import {ScoresDTO} from "../../../infrastructure/driving/dtos/reviewer.dto";

export class Scores {
    technical: number;
    market: number;
    financial: number;
    team: number;
    innovation: number;

    constructor(
        technical: number,
        market: number,
        financial: number,
        team: number,
        innovation: number
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

export const ScoreBuilder = (scores: ScoresDTO): Scores => {
    return new Scores(
        scores.technical,
        scores.market,
        scores.financial,
        scores.team,
        scores.innovation
    );
};
