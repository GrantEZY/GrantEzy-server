/* eslint-disable @typescript-eslint/naming-convention */

export class MarketInfo {
    readonly totalAddressableMarket: string;
    readonly serviceableMarket: string;
    readonly obtainableMarket: string;
    readonly competitorAnalysis: string;

    constructor(
        totalAddressableMarket: string,
        serviceableMarket: string,
        obtainableMarket: string,
        competitorAnalysis: string
    ) {
        this.totalAddressableMarket = totalAddressableMarket;
        this.serviceableMarket = serviceableMarket;
        this.obtainableMarket = obtainableMarket;
        this.competitorAnalysis = competitorAnalysis;
    }

    toJSON() {
        return {
            totalAddressableMarket: this.totalAddressableMarket,
            serviceableMarket: this.serviceableMarket,
            obtainableMarket: this.obtainableMarket,
            competitorAnalysis: this.competitorAnalysis,
        };
    }
}
