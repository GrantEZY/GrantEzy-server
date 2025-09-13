export enum TRL {
    TRL1 = "TRL1",
    TRL2 = "TRL2",
    TRL3 = "TRL3",
    TRL4 = "TRL4",
    TRL5 = "TRL5",
    TRL6 = "TRL6",
    TRL7 = "TRL7",
    TRL8 = "TRL8",
    TRL9 = "TRL9",
}

export const TRLDescriptions: Record<TRL, string> = {
    [TRL.TRL1]: "Basic principles observed and reported",
    [TRL.TRL2]: "Technology concept and/or application formulated",
    [TRL.TRL3]:
        "Analytical and experimental critical function proof-of-concept",
    [TRL.TRL4]:
        "Component and/or breadboard validation in laboratory environment",
    [TRL.TRL5]:
        "Component and/or breadboard validation in relevant environment",
    [TRL.TRL6]:
        "System/subsystem model or prototype demonstration in relevant environment",
    [TRL.TRL7]: "System prototype demonstration in space environment",
    [TRL.TRL8]:
        "Actual system completed and qualified through test and demonstration",
    [TRL.TRL9]: "Actual system proven through successful mission operations",
};

export function getTRLDescription(trl: TRL): string {
    return TRLDescriptions[trl];
}

export function isValidTRL(trl: string): trl is TRL {
    return Object.values(TRL).includes(trl as TRL);
}
