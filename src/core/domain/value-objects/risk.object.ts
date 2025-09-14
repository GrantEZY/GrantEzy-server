/* eslint-disable @typescript-eslint/naming-convention */

import {Impact} from "../constants/risk.constants";

export class Risk {
    readonly description: string;
    readonly impact: Impact;
    readonly mitigation: string;

    constructor(description: string, impact: Impact, mitigation: string) {
        this.description = description;
        this.impact = impact;
        this.mitigation = mitigation;
    }

    toJSON() {
        return {
            description: this.description,
            impact: this.impact,
            mitigation: this.mitigation,
        };
    }
}
