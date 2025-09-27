/* eslint-disable @typescript-eslint/naming-convention */

import {ProjectBasicInfoDTO} from "../../../infrastructure/driving/dtos/applicant.dto";

export class ProjectBasicInfo {
    readonly title: string;
    readonly summary: string;
    readonly problem: string;
    readonly solution: string;
    readonly innovation: string;

    constructor(
        title: string,
        summary: string,
        problem: string,
        solution: string,
        innovation: string
    ) {
        this.title = title;
        this.summary = summary;
        this.problem = problem;
        this.solution = solution;
        this.innovation = innovation;
    }

    toJSON() {
        return {
            title: this.title,
            summary: this.summary,
            problem: this.problem,
            solution: this.solution,
            innovation: this.innovation,
        };
    }
}

export const ProjectBasicInfoObjectBuilder = (
    basicInfo: ProjectBasicInfoDTO
): ProjectBasicInfo => {
    const basicInfoObject = new ProjectBasicInfo(
        basicInfo.title,
        basicInfo.summary,
        basicInfo.problem,
        basicInfo.solution,
        basicInfo.innovation
    );

    return basicInfoObject;
};
