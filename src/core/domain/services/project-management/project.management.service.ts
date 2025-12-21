import {Injectable, Inject} from "@nestjs/common";
import {
    ProjectAggregatePort,
    PROJECT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/project/project.aggregate.port";
import {
    GRANT_APPLICATION_AGGREGATE_PORT,
    GrantApplicationAggregatePort,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {
    CreateCycleProjectsEvalCriteriaDTO,
    CreateProjectDTO,
    GetCycleCriteriaDetailsWithSubmissionDTO,
    GetCycleCriteriasDTO,
    GetCycleProjectsDTO,
    GetProjectDetailsDTO,
    SubmitDetailsForReviewDTO,
    GetCycleCriteriaDetailsWithAssessmentsDTO,
    AddReviewerForProjectAssessmentDTO,
} from "../../../../infrastructure/driving/dtos/project.management.dto";
import {GrantApplicationStatus} from "../../constants/status.constants";
import {
    CreateCriteriaResponse,
    CreateProjectAssessmentSubmissionResponse,
    CreateProjectResponse,
    GetCycleAssessmentCriteriasResponse,
    GetCycleAssessmentDetailsForApplicantResponse,
    GetCycleAssessmentSubmissionsResponse,
    GetCycleProjectsResponse,
    GetProjectDetailsResponse,
} from "../../../../infrastructure/driven/response-dtos/project.management.response-dto";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
import {SharedApplicationService} from "../shared/application/shared.application.service";
import {
    CycleAssessmentCriteriaAggregatePort,
    CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycleAssessmentCriteria/cycle.assessment.criteria.aggregate.port";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    CycleAssessmentAggregatePort,
    CYCLE_ASSESSMENT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycleAssessment/cycle.assessment.aggregate.port";
import {
    UserInviteAggregatePort,
    USER_INVITE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {CycleInviteQueue} from "../../../../infrastructure/driven/queue/queues/cycle.invite.queue";
import {InviteAs} from "../../constants/invite.constants";
import {UserRoles} from "../../constants/userRoles.constants";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../../config/env/app.types";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../ports/outputs/crypto/hash.port";
@Injectable()
export class ProjectManagementService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly grantApplicationRepository: GrantApplicationAggregatePort,

        @Inject(PROJECT_AGGREGATE_PORT)
        private readonly projectAggregateRepository: ProjectAggregatePort,

        @Inject(USER_AGGREGATE_PORT)
        private readonly userRepository: UserAggregatePort,

        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort,

        @Inject(CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT)
        private readonly criteriaRepository: CycleAssessmentCriteriaAggregatePort,

        @Inject(CYCLE_ASSESSMENT_AGGREGATE_PORT)
        private readonly assessmentRepository: CycleAssessmentAggregatePort,

        @Inject(USER_INVITE_AGGREGATE_PORT)
        private readonly userInviteRepository: UserInviteAggregatePort,

        @Inject(PASSWORD_HASHER_PORT)
        private readonly cryptoRepository: PasswordHasherPort,

        private readonly emailQueue: EmailQueue,
        private readonly cycleInviteQueue: CycleInviteQueue,
        private readonly sharedApplicationService: SharedApplicationService,
        private readonly configService: ConfigService<ConfigType>
    ) {}

    /**
     * Creates a new project from an approved grant application.
     */
    async createProject(
        details: CreateProjectDTO,
        userId: string
    ): Promise<CreateProjectResponse> {
        try {
            const {applicationId} = details;

            const application =
                await this.grantApplicationRepository.getUserCreatedApplication(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            const {cycle, applicant, teammates} = application;

            if (cycle.program?.managerId !== userId) {
                throw new ApiError(
                    403,
                    "Program Manager Only Can Access",
                    "Conflict Error"
                );
            }

            if (application.status === GrantApplicationStatus.APPROVED) {
                throw new ApiError(
                    403,
                    "Application is already a project",
                    "Conflict Error"
                );
            }

            const project =
                await this.projectAggregateRepository.createProject(details);

            // Set the projectId on the application for future lookups
            application.projectId = project.id;

            const updatedApplication =
                await this.grantApplicationRepository.modifyApplicationStatus(
                    application,
                    GrantApplicationStatus.APPROVED,
                    false
                );

            await this.emailQueue.createProjectEmailToQueue(
                [applicant, ...teammates],
                updatedApplication.basicDetails.title
            );

            return {
                status: 201,
                message: "Project Created",
                res: {
                    applicationId: application.id,
                    projectId: project.id,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Retrieves all projects under a specific cycle (for program managers).
     */
    async getCycleProjects(
        details: GetCycleProjectsDTO,
        userId: string
    ): Promise<GetCycleProjectsResponse> {
        try {
            const {cycleSlug, page, numberOfResults} = details;

            const cycle =
                await this.cycleAggregateRepository.findCycleByslug(cycleSlug);

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            const managerId = cycle.program?.managerId;

            if (managerId !== userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Access The Route",
                    "Conflict Error"
                );
            }

            const applications =
                await this.sharedApplicationService.getCycleProjects(
                    cycle.id,
                    page,
                    numberOfResults
                );

            return {
                status: 200,
                message: "Cycle Projects",
                res: {applications},
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Retrieves project details using application slug and cycle slug.
     */
    async getProjectDetails(
        applicationDetails: GetProjectDetailsDTO,
        userId: string
    ): Promise<GetProjectDetailsResponse> {
        try {
            const {cycleSlug, applicationSlug} = applicationDetails;

            const application =
                await this.grantApplicationRepository.getUserCreatedApplicationWithSlug(
                    applicationSlug
                );

            if (!application || application.cycle.slug !== cycleSlug) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            if (application.status !== GrantApplicationStatus.APPROVED) {
                throw new ApiError(
                    403,
                    "Application Is Not a Project",
                    "Conflict Error"
                );
            }

            const managerId = application.cycle.program?.managerId;

            if (managerId !== userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Access The Route",
                    "Conflict Error"
                );
            }

            const project =
                await this.projectAggregateRepository.getProjectDetailsWithApplicationId(
                    application.id
                );

            if (!project) {
                throw new ApiError(404, "Project Not Found", "Conflict Error");
            }

            return {
                status: 200,
                message: "Project Details",
                res: {project},
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async createCycleCriteria(
        details: CreateCycleProjectsEvalCriteriaDTO,
        userId: string
    ): Promise<CreateCriteriaResponse> {
        try {
            const {cycleId} = details;

            const cycle = await this.cycleAggregateRepository.findById(cycleId);

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Create The Criteria",
                    "Conflict Error"
                );
            }

            const cycleCriteria =
                await this.criteriaRepository.createCycleCriteria(details);

            const projectApplications =
                await this.sharedApplicationService.getAllCycleProjects(
                    cycle.id
                );

            await this.emailQueue.cycleReviewToQueue(
                projectApplications,
                cycleCriteria.name,
                cycleCriteria.reviewBrief
            );

            return {
                status: 201,
                message: "Criteria Created Successfully",
                res: {
                    criteriaName: cycleCriteria.name,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getCycleCriteria(
        details: GetCycleCriteriasDTO,
        userId: string
    ): Promise<GetCycleAssessmentCriteriasResponse> {
        try {
            const {cycleSlug} = details;

            const cycle =
                await this.cycleAggregateRepository.findCycleByslug(cycleSlug);

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Get The Criterias",
                    "Conflict Error"
                );
            }

            const criterias =
                await this.criteriaRepository.getCycleEvaluationCriterias(
                    cycle.id
                );

            return {
                status: 200,
                message: "Criterias For Cycle",
                res: {
                    criterias,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getUserProjectCycleCriteria(
        details: GetCycleCriteriasDTO,
        userId: string
    ): Promise<GetCycleAssessmentCriteriasResponse> {
        try {
            const {cycleSlug} = details;

            const cycle =
                await this.cycleAggregateRepository.findCycleByslug(cycleSlug);

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            const application =
                await this.grantApplicationRepository.findUserCycleApplication(
                    userId,
                    cycle.id
                );

            if (!application) {
                throw new ApiError(
                    403,
                    "User Doesn't have a project for this cycle",
                    "Conflict Error"
                );
            }

            if (
                !(
                    application.status === GrantApplicationStatus.APPROVED ||
                    application.status === GrantApplicationStatus.ARCHIVED
                )
            ) {
                throw new ApiError(
                    403,
                    "Project should be active or archived",
                    "Conflict Error"
                );
            }

            const criterias =
                await this.criteriaRepository.getCycleEvaluationCriterias(
                    cycle.id
                );

            return {
                status: 200,
                message: "Criterias For Cycle",
                res: {
                    criterias,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getUserProjectReviewCriteria(
        details: GetCycleCriteriaDetailsWithSubmissionDTO,
        userId: string
    ): Promise<GetCycleAssessmentDetailsForApplicantResponse> {
        try {
            const {cycleSlug, criteriaSlug} = details;

            const cycle =
                await this.cycleAggregateRepository.findCycleByslug(cycleSlug);

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            const application =
                await this.grantApplicationRepository.findUserCycleApplication(
                    userId,
                    cycle.id
                );

            if (!application) {
                throw new ApiError(
                    403,
                    "User Doesn't have a project for this cycle",
                    "Conflict Error"
                );
            }

            if (
                !(
                    application.status === GrantApplicationStatus.APPROVED ||
                    application.status === GrantApplicationStatus.ARCHIVED
                )
            ) {
                throw new ApiError(
                    403,
                    "Project should be active or archived",
                    "Conflict Error"
                );
            }

            // Get projectId - if not set, find project by applicationId
            let projectId = application.projectId;
            if (!projectId) {
                const project = await this.projectAggregateRepository.getProjectDetailsWithApplicationId(
                    application.id
                );
                if (!project) {
                    throw new ApiError(
                        403,
                        "User Doesn't have a project for this cycle",
                        "Conflict Error"
                    );
                }
                projectId = project.id;
            }

            const criteria =
                await this.criteriaRepository.getCriteriaDetails(criteriaSlug);

            if (!criteria) {
                throw new ApiError(
                    404,
                    "Review Criteria Not Found",
                    "Conflict Error"
                );
            }

            const cycleSubmission =
                await this.assessmentRepository.getCriteriaWithCriteriaIdAndProjectId(
                    criteria.id,
                    projectId
                );

            return {
                status: 200,
                message: "Project Cycle Review Details",
                res: {
                    criteria,
                    cycleSubmission,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async createAssessmentForProject(
        details: SubmitDetailsForReviewDTO,
        userId: string
    ): Promise<CreateProjectAssessmentSubmissionResponse> {
        try {
            const {
                criteriaId,
                cycleSlug,
                reviewStatement,
                reviewSubmissionFile,
            } = details;

            const criteria =
                await this.criteriaRepository.getCriteriaDetailsWithId(
                    criteriaId
                );
            if (!criteria || criteria.cycle.slug != cycleSlug) {
                throw new ApiError(404, "Criteria Not Found", "Conflict Error");
            }

            const application =
                await this.grantApplicationRepository.findUserCycleApplication(
                    userId,
                    criteria.cycleId
                );

            if (!application) {
                throw new ApiError(
                    403,
                    "Application Is Not a Project",
                    "Conflict Error"
                );
            }

            if (
                !(
                    application.status === GrantApplicationStatus.APPROVED ||
                    application.status === GrantApplicationStatus.ARCHIVED
                )
            ) {
                throw new ApiError(
                    403,
                    "Application Is Not a Project",
                    "Conflict Error"
                );
            }

            // Get projectId - if not set, find project by applicationId
            let projectId = application.projectId;
            if (!projectId) {
                const project = await this.projectAggregateRepository.getProjectDetailsWithApplicationId(
                    application.id
                );
                if (!project) {
                    throw new ApiError(
                        403,
                        "Application Is Not a Project",
                        "Conflict Error"
                    );
                }
                projectId = project.id;
            }

            const submittedAssessment =
                await this.assessmentRepository.getCriteriaWithCriteriaIdAndProjectId(
                    criteriaId,
                    projectId
                );

            if (submittedAssessment) {
                const newSubmittedAssessment =
                    await this.assessmentRepository.updateAssessmentForProject(
                        submittedAssessment,
                        {
                            projectId: projectId,
                            criteriaId,
                            reviewBrief: reviewStatement,
                            reviewFile: reviewSubmissionFile,
                        }
                    );

                return {
                    status: 200,
                    message: "Project Assessment Updated",
                    res: {
                        submission: newSubmittedAssessment,
                    },
                };
            }

            const assessmentSubmission =
                await this.assessmentRepository.createAssessmentForProject(
                    projectId,
                    criteriaId,
                    reviewStatement,
                    reviewSubmissionFile
                );

            return {
                status: 201,
                message: "Project Assessment Created",
                res: {
                    submission: assessmentSubmission,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getCycleCriteriaAssessments(
        details: GetCycleCriteriaDetailsWithAssessmentsDTO,
        userId: string
    ): Promise<GetCycleAssessmentSubmissionsResponse> {
        try {
            const {criteriaSlug, cycleSlug, page, numberOfResults} = details;

            const criteria =
                await this.criteriaRepository.getCriteriaDetails(criteriaSlug);

            if (!criteria || criteria.cycle.slug != cycleSlug) {
                throw new ApiError(404, "Criteria Not Found", "Conflict Error");
            }

            const managerId = criteria.cycle.program?.managerId;

            if (managerId !== userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Access the Criteria Submissions",
                    "Conflict Error"
                );
            }

            const submissions =
                await this.assessmentRepository.getAssessmentSubmissionForACycleCriteria(
                    criteria.id,
                    page,
                    numberOfResults
                );

            return {
                status: 200,
                message: "Criteria Submissions For Assessment",
                res: {
                    submissions,
                    criteria,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async assignReviewForProjectAssessment(
        details: AddReviewerForProjectAssessmentDTO,
        userId: string
    ) {
        try {
            const {assessmentId, email} = details;

            const assessment =
                await this.assessmentRepository.findById(assessmentId);

            if (!assessment) {
                throw new ApiError(
                    404,
                    "Assessment Not Found",
                    "Conflict Error"
                );
            }

            const managerId = assessment.criteria.cycle.program?.managerId;

            const user = await this.userRepository.findById(userId, false);

            if (user == null || managerId !== userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Assign Reviewer",
                    "Conflict Error"
                );
            }

            const application = assessment.project.application!; // eslint-disable-line

            const cycle = assessment.criteria.cycle;
            const invite =
                await this.userInviteRepository.addApplicationInvites(
                    application.id,
                    [email],
                    InviteAs.PROJECT_REVIEWER
                );

            const baseUrl = this.configService.get("app").CLIENT_URL;

            const encryptedAssessmentId = this.cryptoRepository.encrypt(
                assessment.id
            );

            const inviteResponse = await this.cycleInviteQueue.UserCycleInvite({
                email,
                invitedBy: user.person.firstName,
                inviteAs: InviteAs.PROJECT_REVIEWER,
                role: UserRoles.REVIEWER,
                programName: cycle.program?.details.name ?? "Program",
                round: cycle.round,
                applicationName: application.basicDetails.title,
                inviteUrl: `${baseUrl as string}/project-assessment/invite-accept-or-reject/?token=${invite[email][0]}&slug=${invite[email][1]}&assessment=${encodeURIComponent(
                    encryptedAssessmentId
                )}`,
            });

            if (!inviteResponse.status) {
                throw new ApiError(
                    500,
                    "Failed to send invite email",
                    "Server Error"
                );
            }

            return {
                status: 201,
                message: "Reviewer Assigned Successfully",
                res: {
                    email,
                    application: application.basicDetails.title,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Handles and standardizes all service errors.
     */
    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
