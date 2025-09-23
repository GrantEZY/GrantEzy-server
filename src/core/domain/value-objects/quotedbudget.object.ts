import {Money} from "./project.metrics.object";

export class BudgetComponent {
    readonly BudgetReason: string;
    readonly Budget: Money;

    constructor(budgetReason: string, budget: Money) {
        this.BudgetReason = budgetReason;
        this.Budget = budget;
    }

    toJSON() {
        return {
            BudgetReason: this.BudgetReason,
            Budget: this.Budget?.toJSON ? this.Budget.toJSON() : this.Budget,
        };
    }
}

export class QuotedBudget {
    readonly ManPower: BudgetComponent[];
    readonly Equipment: BudgetComponent[];
    readonly OtherCosts: BudgetComponent[];
    readonly Consumables: BudgetComponent;
    readonly Travel: BudgetComponent;
    readonly Contigency: BudgetComponent;
    readonly Overhead: BudgetComponent;

    constructor(
        manPower: BudgetComponent[],
        equipment: BudgetComponent[],
        otherCosts: BudgetComponent[],
        consumables: BudgetComponent,
        travel: BudgetComponent,
        contigency: BudgetComponent,
        overhead: BudgetComponent
    ) {
        this.ManPower = manPower;
        this.Equipment = equipment;
        this.OtherCosts = otherCosts;
        this.Consumables = consumables;
        this.Travel = travel;
        this.Contigency = contigency;
        this.Overhead = overhead;
    }

    toJSON() {
        return {
            ManPower: this.ManPower?.map((c) => c.toJSON()) ?? [],
            Equipment: this.Equipment?.map((c) => c.toJSON()) ?? [],
            OtherCosts: this.OtherCosts?.map((c) => c.toJSON()) ?? [],
            Consumables: this.Consumables?.toJSON(),
            Travel: this.Travel?.toJSON(),
            Contigency: this.Contigency?.toJSON(),
            Overhead: this.Overhead?.toJSON(),
        };
    }
}
