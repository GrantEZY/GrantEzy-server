import {CycleAssessmentAggregate} from "../../../../core/domain/aggregates/cycle.assessment.aggregate";

export interface CycleAssessmentAggregatePort {
    getCriteriaWithCriteriaIdAndProjectId(
        criteriaId: string,
        projectId: string
    ): Promise<CycleAssessmentAggregate | null>;
}

export const CYCLE_ASSESSMENT_AGGREGATE_PORT = Symbol(
    "CycleInterfaceAggregatePort"
);
