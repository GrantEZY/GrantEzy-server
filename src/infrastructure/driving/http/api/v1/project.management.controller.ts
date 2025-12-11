import {Body, Controller, Post, Res, Query, Get} from "@nestjs/common";
import {Response} from "express";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ProjectManagementControllerPort} from "../../../../../ports/inputs/controllers/project.management.controller.port";
import {
    CreateCycleProjectsEvalCriteriaDTO,
    CreateProjectDTO,
    GetCycleProjectsDTO,
    GetCycleCriteriaDetailsWithSubmissionDTO,
    GetProjectDetailsDTO,
    GetCycleCriteriasDTO,
    SubmitDetailsForReviewDTO,
    GetCycleCriteriaDetailsWithAssessmentsDTO,
    AddReviewerForProjectAssessmentDTO,
} from "../../../dtos/project.management.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {ProjectManagementService} from "../../../../../core/domain/services/project-management/project.management.service";
import {CurrentUser} from "../../../../../shared/decorators/currentuser.decorator";
import {AccessTokenJwt} from "../../../../../shared/types/jwt.types";
import {
    PROJECT_MANAGEMENT_RESPONSES,
    CYCLE_CRITERIA_RESPONSES,
    APPLICANT_PROJECT_MANAGEMENT,
    PROJECT_ASSESSMENT_REVIEWER_RESPONSES,
} from "../../../../../config/swagger/docs/project.management.swagger";
@ApiTags("Project Management")
@Controller("pt-management")
export class ProjectManagementController
    implements ProjectManagementControllerPort
{
    constructor(
        private readonly projectManagementService: ProjectManagementService
    ) {}

    @Post("/create-project")
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.CREATE.SUCCESS)
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.CREATE.APPLICATION_NOT_ELIGIBLE)
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.CREATE.APPLICATION_NOT_FOUND)
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.CREATE.UNAUTHORIZED_MANAGER)
    async createProject(
        @Body() body: CreateProjectDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result = await this.projectManagementService.createProject(
                body,
                id
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-cycle-projects")
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.GET_CYCLE_PROJECTS.SUCCESS)
    @ApiResponse(
        PROJECT_MANAGEMENT_RESPONSES.GET_CYCLE_PROJECTS.UNAUTHORIZED_MANAGER
    )
    @ApiResponse(
        PROJECT_MANAGEMENT_RESPONSES.GET_CYCLE_PROJECTS.CYCLE_NOT_FOUND
    )
    async getCycleProjects(
        @Query() parameters: GetCycleProjectsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.projectManagementService.getCycleProjects(
                parameters,
                id
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-project-details")
    @ApiResponse(
        PROJECT_MANAGEMENT_RESPONSES.GET_PROJECT_DETAILS.APPLICATION_NOT_FOUND
    )
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.GET_PROJECT_DETAILS.NOT_A_PROJECT)
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.GET_PROJECT_DETAILS.SUCCESS)
    @ApiResponse(PROJECT_MANAGEMENT_RESPONSES.GET_PROJECT_DETAILS.SUCCESS)
    async getProjectDetails(
        @Query() parameters: GetProjectDetailsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.projectManagementService.getProjectDetails(
                    parameters,
                    id
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/create-cycle-criteria")
    @ApiResponse(CYCLE_CRITERIA_RESPONSES.CREATE_CRITERIA.SUCCESS)
    @ApiResponse(CYCLE_CRITERIA_RESPONSES.CREATE_CRITERIA.CYCLE_NOT_FOUND)
    @ApiResponse(CYCLE_CRITERIA_RESPONSES.CREATE_CRITERIA.UNAUTHORIZED_MANAGER)
    async createCycleCriteria(
        @Body() body: CreateCycleProjectsEvalCriteriaDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.projectManagementService.createCycleCriteria(
                    body,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-cycle-criterias")
    @ApiResponse(CYCLE_CRITERIA_RESPONSES.GET_CYCLE_CRITERIA.SUCCESS)
    @ApiResponse(CYCLE_CRITERIA_RESPONSES.GET_CYCLE_CRITERIA.CYCLE_NOT_FOUND)
    @ApiResponse(
        CYCLE_CRITERIA_RESPONSES.GET_CYCLE_CRITERIA.UNAUTHORIZED_MANAGER
    )
    async getCycleCriterias(
        @Query() parameters: GetCycleCriteriasDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result = await this.projectManagementService.getCycleCriteria(
                parameters,
                id
            );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-applicant-project-cycle-review-criteria")
    @ApiResponse(APPLICANT_PROJECT_MANAGEMENT.GET_USER_CYCLE_CRITERIA.SUCCESS)
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_USER_CYCLE_CRITERIA.CYCLE_NOT_FOUND
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_USER_CYCLE_CRITERIA
            .INVALID_PROJECT_STATUS
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_USER_CYCLE_CRITERIA.USER_NOT_IN_CYCLE
    )
    async getApplicantCycleReviewCriterias(
        @Query() parameters: GetCycleCriteriasDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.projectManagementService.getUserProjectCycleCriteria(
                    parameters,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-applicant-cycle-assessment-submission")
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_USER_REVIEW_CRITERIA_DETAILS.SUCCESS
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_USER_REVIEW_CRITERIA_DETAILS
            .CRITERIA_NOT_FOUND
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_USER_REVIEW_CRITERIA_DETAILS
            .CYCLE_NOT_FOUND
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_USER_REVIEW_CRITERIA_DETAILS
            .USER_NOT_IN_CYCLE
    )
    async getApplicantCycleAssessmentSubmission(
        @Query() parameters: GetCycleCriteriaDetailsWithSubmissionDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.projectManagementService.getUserProjectReviewCriteria(
                    parameters,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/create-applicant-project-assessment-submission")
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.CREATE_PROJECT_ASSESSMENT.SUCCESS_CREATED
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.CREATE_PROJECT_ASSESSMENT.SUCCESS_UPDATED
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.CREATE_PROJECT_ASSESSMENT
            .APPLICATION_NOT_PROJECT
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.CREATE_PROJECT_ASSESSMENT
            .CRITERIA_NOT_FOUND
    )
    async createApplicantProjectAssessmentSubmission(
        @Body() body: SubmitDetailsForReviewDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.projectManagementService.createAssessmentForProject(
                    body,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Get("/get-cycle-criteria-assessments")
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_CYCLE_CRITERIA_ASSESSMENTS.SUCCESS
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_CYCLE_CRITERIA_ASSESSMENTS
            .CRITERIA_NOT_FOUND
    )
    @ApiResponse(
        APPLICANT_PROJECT_MANAGEMENT.GET_CYCLE_CRITERIA_ASSESSMENTS
            .UNAUTHORIZED_MANAGER
    )
    async getCycleCriteriaSubmissions(
        @Query() parameters: GetCycleCriteriaDetailsWithAssessmentsDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;

            const result =
                await this.projectManagementService.getCycleCriteriaAssessments(
                    parameters,
                    id
                );

            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    @Post("/invite-reviewer-for-project-assessment")
    @ApiResponse(PROJECT_ASSESSMENT_REVIEWER_RESPONSES.ASSIGN.SUCCESS)
    @ApiResponse(
        PROJECT_ASSESSMENT_REVIEWER_RESPONSES.ASSIGN.UNAUTHORIZED_MANAGER
    )
    @ApiResponse(
        PROJECT_ASSESSMENT_REVIEWER_RESPONSES.ASSIGN.ASSESSMENT_NOT_FOUND
    )
    @ApiResponse(PROJECT_ASSESSMENT_REVIEWER_RESPONSES.ASSIGN.INVITE_FAILED)
    async inviteReviewerForProjectAssessment(
        @Body() body: AddReviewerForProjectAssessmentDTO,
        @CurrentUser() user: AccessTokenJwt,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const id = user.userData.payload.id;
            const result =
                await this.projectManagementService.assignReviewForProjectAssessment(
                    body,
                    id
                );
            return response.status(result.status).json(result);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    handleError(error: unknown, response: Response): Response {
        if (error instanceof ApiError) {
            return response.status(error.status).json({
                status: error.status,
                message: error.message,
                res: null,
            });
        }
        return response.status(500).json({
            status: 500,
            message: "Internal Server Error",
            res: null,
        });
    }
}
