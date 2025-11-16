import {CycleAssessmentCriteriaAggregate} from "../../../../core/domain/aggregates/cycle.assessment.criteria.aggregate";
import {CreateCycleProjectsEvalCriteriaDTO} from "../../../../infrastructure/driving/dtos/project.management.dto";

export interface CycleAssessmentCriteriaAggregatePort {
    createCycleCriteria(
        details: CreateCycleProjectsEvalCriteriaDTO
    ): Promise<CycleAssessmentCriteriaAggregate>;

    getCycleEvaluationCriterias(
        cycleId: string
    ): Promise<CycleAssessmentCriteriaAggregate[]>;

    getCriteriaDetails(
        slug: string
    ): Promise<CycleAssessmentCriteriaAggregate | null>;

    getCriteriaDetailsWithId(
        criteriaId: string
    ): Promise<CycleAssessmentCriteriaAggregate | null>;
}

export const CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT = Symbol(
    "CycleAssessmentCriteriaAggregatePort"
);
