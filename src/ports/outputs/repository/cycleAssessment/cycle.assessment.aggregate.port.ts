import {CycleAssessmentAggregate} from "../../../../core/domain/aggregates/cycle.assessment.aggregate";
import {DocumentObjectDTO} from "../../../../infrastructure/driving/dtos/applicant.dto";

export interface CycleAssessmentAggregatePort {
    getCriteriaWithCriteriaIdAndProjectId(
        criteriaId: string,
        projectId: string
    ): Promise<CycleAssessmentAggregate | null>;

    createAssessmentForProject(
        projectId: string,
        criteriaId: string,
        reviewBrief: string,
        reviewFile: DocumentObjectDTO
    ): Promise<CycleAssessmentAggregate>;

    updateAssessmentForProject(
        assessment: CycleAssessmentAggregate,
        details: {
            projectId: string;
            criteriaId: string;
            reviewBrief: string;
            reviewFile: DocumentObjectDTO;
        }
    ): Promise<CycleAssessmentAggregate>;

    getAssessmentSubmissionForACycleCriteria(
        criteriaId: string,
        page: number,
        numberOfResults: number
    ): Promise<CycleAssessmentAggregate[]>;
}

export const CYCLE_ASSESSMENT_AGGREGATE_PORT = Symbol(
    "CycleInterfaceAggregatePort"
);
