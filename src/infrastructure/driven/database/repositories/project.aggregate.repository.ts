import {ProjectAggregatePort} from "../../../../ports/outputs/repository/project/project.aggregate.port";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Project} from "../../../../core/domain/aggregates/project.aggregate";
import {CreateProjectDTO} from "../../../driving/dtos/project.management.dto";
import ApiError from "../../../../shared/errors/api.error";
import {QuotedBudgetObjectBuilder} from "../../../../core/domain/value-objects/quotedbudget.object";
import {DurationObjectBuilder} from "../../../../core/domain/value-objects/duration.object";
import {ProjectMetricsBuilder} from "../../../../core/domain/value-objects/project.metrics.object";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {v4 as uuid} from "uuid";
import {ProjectStatus} from "../../../../core/domain/constants/status.constants";
@Injectable()
export class ProjectAggregateRepository implements ProjectAggregatePort {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>
    ) {}

    async createProject(details: CreateProjectDTO): Promise<Project> {
        try {
            const {applicationId, allocatedBudget, plannedDuration} = details;

            const projectAllocatedBudget =
                QuotedBudgetObjectBuilder(allocatedBudget);

            const projectPlannedDuration =
                DurationObjectBuilder(plannedDuration);

            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);

            const projectMetrics = ProjectMetricsBuilder(
                projectAllocatedBudget,
                null,
                projectPlannedDuration,
                null
            );

            const project = this.projectRepository.create({
                allotedBudget: projectAllocatedBudget,
                metrics: projectMetrics,
                applicationId,
                slug,
                duration: projectPlannedDuration,
                status: ProjectStatus.ACTIVE,
            });

            const newProject = await this.projectRepository.save(project);

            return newProject;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to save project", "Database Error");
        }
    }

    async getProjectDetailsWithApplicationId(
        applicationId: string
    ): Promise<Project | null> {
        try {
            const project = await this.projectRepository.findOne({
                where: {
                    applicationId,
                },
                relations: ["application", "application.cycle"],
            });

            return project;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch project details",
                "Database Error"
            );
        }
    }

    async modifyProjectStatus(
        project: Project,
        status: ProjectStatus
    ): Promise<Project> {
        try {
            project.status = status;
            const updatedProject = await this.projectRepository.save(project);
            return updatedProject;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to modify project status",
                "Database"
            );
        }
    }
}
