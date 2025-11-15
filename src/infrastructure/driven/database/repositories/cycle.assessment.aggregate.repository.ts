import {CycleAssessmentAggregatePort} from "../../../../ports/outputs/repository/cycleAssessment/cycle.assessment.aggregate.port";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {Injectable} from "@nestjs/common";
import {CycleAssessmentAggregate} from "../../../../core/domain/aggregates/cycle.assessment.aggregate";
@Injectable()
export class CycleAssessmentAggregateRepository
    implements CycleAssessmentAggregatePort
{
    constructor(
        @InjectRepository(CycleAssessmentAggregate)
        private readonly assessmentRepository: Repository<CycleAssessmentAggregate>
    ) {}

    async getCriteriaWithCriteriaIdAndProjectId(
        criteriaId: string,
        projectId: string
    ): Promise<CycleAssessmentAggregate | null> {
        try {
            const criteria = await this.assessmentRepository.findOne({
                where: {
                    criteriaId,
                    projectId,
                },
            });

            return criteria;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Error in fetching criterias",
                "Database Error"
            );
        }
    }
}
