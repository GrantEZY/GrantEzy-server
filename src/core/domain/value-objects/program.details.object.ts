/* eslint-disable @typescript-eslint/naming-convention */

export class ProgramDetails {
    readonly name: string;
    readonly description: string;
    readonly category: string;

    constructor(name: string, description: string, category: string) {
        this.name = name;
        this.description = description;
        this.category = category;
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            category: this.category,
        };
    }
}
