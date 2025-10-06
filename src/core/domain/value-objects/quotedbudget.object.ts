import {QuotedBudgetDTO} from "../../../infrastructure/driving/dtos/applicant.dto";
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

export const QuotedBudgetObjectBuilder = (
    budget: QuotedBudgetDTO
): QuotedBudget => {
    const {
        ManPower,
        Equipment,
        Travel,
        OtherCosts,
        Consumables,
        Contigency,
        Overhead,
    } = budget;

    // eslint-disable-next-line
    const manPowerBudget = ManPower.map(
        (manPowerComponent) =>
            new BudgetComponent(
                manPowerComponent.BudgetReason,
                new Money(
                    manPowerComponent.Budget.amount,
                    manPowerComponent.Budget.currency
                )
            )
    );

    // eslint-disable-next-line
    const equipmentBudget = Equipment.map(
        (equipmentComponent) =>
            new BudgetComponent(
                equipmentComponent.BudgetReason,
                new Money(
                    equipmentComponent.Budget.amount,
                    equipmentComponent.Budget.currency
                )
            )
    );

    //eslint-disable-next-line
    const otherCostsBudget = OtherCosts.map(
        (otherCostComponent) =>
            new BudgetComponent(
                otherCostComponent.BudgetReason,
                new Money(
                    otherCostComponent.Budget.amount,
                    otherCostComponent.Budget.currency
                )
            )
    );

    const consumablesBudget = new BudgetComponent(
        Consumables.BudgetReason,
        new Money(Consumables.Budget.amount, Consumables.Budget.currency)
    );

    const travelBudget = new BudgetComponent(
        Travel.BudgetReason,
        new Money(Travel.Budget.amount, Travel.Budget.currency)
    );

    const contigencyBudget = new BudgetComponent(
        Contigency.BudgetReason,
        new Money(Contigency.Budget.amount, Contigency.Budget.currency)
    );

    const overHeadBudget = new BudgetComponent(
        Overhead.BudgetReason,
        new Money(Overhead.Budget.amount, Overhead.Budget.currency)
    );

    const quotedBudget = new QuotedBudget(
        manPowerBudget,
        equipmentBudget,
        otherCostsBudget,
        consumablesBudget,
        travelBudget,
        contigencyBudget,
        overHeadBudget
    );

    return quotedBudget;
};
