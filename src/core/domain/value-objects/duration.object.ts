import {DurationDTO} from "../../../infrastructure/driving/dtos/pm.dto";

export class Duration {
    startDate: Date;
    endDate: Date | null;

    constructor(startDate: Date, endDate: Date | null) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    toJSON() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
        };
    }
}

export function DurationObjectBuilder(duration: DurationDTO): Duration {
    return new Duration(duration.startDate, duration.endDate ?? null);
}
