import {CycleAssessmentAggregatePort} from "../../../../ports/outputs/repository/cycleAssessment/cycle.assessment.aggregate.port";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {Injectable} from "@nestjs/common";
import {CycleAssessmentAggregate} from "../../../../core/domain/aggregates/cycle.assessment.aggregate";
import {DocumentObjectBuilder} from "../../../../core/domain/value-objects/document.object";
import {DocumentObjectDTO} from "../../../driving/dtos/applicant.dto";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
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

    async createAssessmentForProject(
        projectId: string,
        criteriaId: string,
        reviewBrief: string,
        reviewFile: DocumentObjectDTO
    ): Promise<CycleAssessmentAggregate> {
        try {
            const document = DocumentObjectBuilder(reviewFile);

            const id = uuid();
            const slug = slugify(id);

            const assessmentSubmission = this.assessmentRepository.create({
                slug,
                reviewBrief,
                criteriaId,
                projectId,
                reviewDocument: document,
            });

            return await this.assessmentRepository.save(assessmentSubmission);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Error in criteria assessment",
                "Database Error"
            );
        }
    }

    async updateAssessmentForProject(
        assessment: CycleAssessmentAggregate,
        details: {
            projectId: string;
            criteriaId: string;
            reviewBrief: string;
            reviewFile: DocumentObjectDTO;
        }
    ): Promise<CycleAssessmentAggregate> {
        try {
            const {reviewBrief, reviewFile, criteriaId, projectId} = details;

            const document = DocumentObjectBuilder(reviewFile);

            assessment.criteriaId = criteriaId;
            assessment.projectId = projectId;
            assessment.reviewBrief = reviewBrief;
            assessment.reviewDocument = document;

            return await this.assessmentRepository.save(assessment);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Error in updating assessment",
                "Database Error"
            );
        }
    }

    async getAssessmentSubmissionForACycleCriteria(
        criteriaId: string,
        page: number,
        numberOfResults: number
    ): Promise<CycleAssessmentAggregate[]> {
        try {
            const submissions = await this.assessmentRepository.find({
                where: {
                    criteriaId,
                },
                relations: ["project"],
                skip: (page - 1) * numberOfResults,
                take: numberOfResults,
            });

            return submissions;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Error in getting assessment submission",
                "Database Error"
            );
        }
    }
}
