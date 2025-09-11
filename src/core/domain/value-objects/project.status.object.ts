/* eslint-disable @typescript-eslint/naming-convention */

import {ProjectStatus} from "../constants/status.constants";

export class ProjectMilestone {
    readonly title: string;
    readonly description: string;
    readonly deliverables: string[];
    readonly status: ProjectStatus;
    readonly dueDate: Date;
    readonly completedDate?: Date; // optional

    constructor(
        title: string,
        description: string,
        deliverables: string[],
        status: ProjectStatus,
        dueDate: Date,
        completedDate?: Date
    ) {
        this.title = title;
        this.description = description;
        this.deliverables = deliverables;
        this.status = status;
        this.dueDate = dueDate;
        this.completedDate = completedDate;
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            deliverables: this.deliverables,
            status: this.status,
            dueDate: this.dueDate,
            completedDate: this.completedDate,
        };
    }
}
