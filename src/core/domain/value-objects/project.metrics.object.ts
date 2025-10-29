/* eslint-disable @typescript-eslint/naming-convention */

import {QuotedBudget} from "./quotedbudget.object";
import {MoneyDTO} from "../../../infrastructure/driving/dtos/pm.dto";
import {Duration} from "./duration.object";
export class ProjectMetrics {
    readonly plannedBudget: QuotedBudget;
    readonly actualSpent: QuotedBudget | null;
    readonly plannedDuration: Duration;
    readonly actualDuration: Duration | null;

    constructor(
        plannedBudget: QuotedBudget,
        actualSpent: QuotedBudget | null,
        plannedDuration: Duration,
        actualDuration: Duration | null
    ) {
        this.plannedBudget = plannedBudget;
        this.actualSpent = actualSpent;
        this.plannedDuration = plannedDuration;
        this.actualDuration = actualDuration;
    }

    toJSON() {
        return {
            plannedBudget: this.plannedBudget,
            actualSpent: this.actualSpent,
            plannedDuration: this.plannedDuration,
            actualDuration: this.actualDuration,
        };
    }
}

export class Money {
    readonly amount: number;
    readonly currency: string;

    constructor(amount: number, currency: string) {
        this.amount = amount;
        this.currency = currency;
    }

    toJSON() {
        return {
            amount: this.amount,
            currency: this.currency,
        };
    }
}

export const MoneyBuilder = (money: MoneyDTO): Money => {
    return new Money(money.amount, money.currency);
};
