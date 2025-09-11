/* eslint-disable @typescript-eslint/naming-convention */

export class ProjectMetrics {
    readonly plannedBudget: Money;
    readonly actualSpent: Money;
    readonly plannedDuration: number; // e.g. in milliseconds or days
    readonly actualDuration: number; // e.g. in milliseconds or days

    constructor(
        plannedBudget: Money,
        actualSpent: Money,
        plannedDuration: number,
        actualDuration: number
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
