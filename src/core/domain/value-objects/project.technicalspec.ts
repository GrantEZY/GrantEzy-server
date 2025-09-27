import {TechnicalSpecDTO} from "../../../infrastructure/driving/dtos/applicant.dto";

export class TechnicalSpec {
    description: string;
    techStack: string[];
    prototype: string;

    constructor(description: string, techStack: string[], prototype: string) {
        this.description = description;
        this.techStack = techStack;
        this.prototype = prototype;
    }

    toJSON() {
        return {
            description: this.description,
            techStack: this.techStack,
            prototype: this.prototype,
        };
    }
}

export const TechnicalSpecObjectBuilder = (
    technicalSpec: TechnicalSpecDTO
): TechnicalSpec => {
    const applicationTechnicalSpec = new TechnicalSpec(
        technicalSpec.description,
        technicalSpec.techStack,
        technicalSpec.prototype
    );

    return applicationTechnicalSpec;
};
