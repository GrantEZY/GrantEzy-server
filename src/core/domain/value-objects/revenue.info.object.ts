/* eslint-disable @typescript-eslint/naming-convention */
import {RevenueType} from "../constants/revenue.constants";

export class RevenueStream {
    readonly type: RevenueType;
    readonly description: string;
    readonly percentage: number;

    constructor(type: RevenueType, description: string, percentage: number) {
        this.type = type;
        this.description = description;
        this.percentage = percentage;
    }

    toJSON() {
        return {
            type: this.type,
            description: this.description,
            percentage: this.percentage,
        };
    }
}

export class RevenueModel {
    readonly primaryStream: RevenueStream;
    readonly secondaryStreams: RevenueStream[];
    readonly pricing: string;
    readonly unitEconomics: string;

    constructor(
        primaryStream: RevenueStream,
        secondaryStreams: RevenueStream[],
        pricing: string,
        unitEconomics: string
    ) {
        this.primaryStream = primaryStream;
        this.secondaryStreams = secondaryStreams;
        this.pricing = pricing;
        this.unitEconomics = unitEconomics;
    }

    toJSON() {
        return {
            primaryStream: this.primaryStream,
            secondaryStreams: this.secondaryStreams,
            pricing: this.pricing,
            unitEconomics: this.unitEconomics,
        };
    }
}
