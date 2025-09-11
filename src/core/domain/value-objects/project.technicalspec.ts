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
