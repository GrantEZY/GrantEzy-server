import {CycleAssessmentCriteriaAggregatePort} from "../../../../ports/outputs/repository/cycleAssessmentCriteria/cycle.assessment.criteria.aggregate.port";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CycleAssessmentCriteriaAggregate} from "../../../../core/domain/aggregates/cycle.assessment.criteria.aggregate";
import {CreateCycleProjectsEvalCriteriaDTO} from "../../../driving/dtos/project.management.dto";
import ApiError from "../../../../shared/errors/api.error";
import {DocumentObjectBuilder} from "../../../../core/domain/value-objects/document.object";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {CycleAssessmentStatus} from "../../../../core/domain/constants/status.constants";
@Injectable()
export class CycleAssessmentCriteriaAggregateRepository
    implements CycleAssessmentCriteriaAggregatePort
{
    constructor(
        @InjectRepository(CycleAssessmentCriteriaAggregate)
        private readonly criteriaRepository: Repository<CycleAssessmentCriteriaAggregate>
    ) {}

    async createCycleCriteria(
        details: CreateCycleProjectsEvalCriteriaDTO
    ): Promise<CycleAssessmentCriteriaAggregate> {
        try {
            const {templateFile, briefReview, name, cycleId} = details;

            let criteriaTemplateFile = null;
            if (templateFile) {
                criteriaTemplateFile = DocumentObjectBuilder(templateFile);
            }
            const id = uuid();

            const slug = slugify(id);
            const newCycleAssessmentCriteria = this.criteriaRepository.create({
                reviewBrief: briefReview,
                name,
                cycleId,
                templateSubmissionFile: criteriaTemplateFile,
                slug,
                status: CycleAssessmentStatus.OPEN,
            });

            return await this.criteriaRepository.save(
                newCycleAssessmentCriteria
            );
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                502,
                "Failed to save criteria",
                "Database Error"
            );
        }
    }

    async getCycleEvaluationCriterias(
        cycleId: string
    ): Promise<CycleAssessmentCriteriaAggregate[]> {
        try {
            const criterias = await this.criteriaRepository.find({
                where: {
                    cycleId,
                },
            });

            return criterias;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                502,
                "Failed to fetch cycle criterias",
                "Database Error"
            );
        }
    }

    async getCriteriaDetails(
        slug: string
    ): Promise<CycleAssessmentCriteriaAggregate | null> {
        try {
            const criteria = await this.criteriaRepository.findOne({
                where: {
                    slug,
                },
            });

            return criteria;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                502,
                "Failed to fetch  criteria details",
                "Database Error"
            );
        }
    }
    async getCriteriaDetailsWithId(
        criteriaId: string
    ): Promise<CycleAssessmentCriteriaAggregate | null> {
        try {
            const criteria = await this.criteriaRepository.findOne({
                where: {
                    id: criteriaId,
                },
                relations: ["cycle"],
            });

            return criteria;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                502,
                "Failed to fetch  criteria details",
                "Database Error"
            );
        }
    }
}
