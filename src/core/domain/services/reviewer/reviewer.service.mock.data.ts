import {InviteAs} from "../../constants/invite.constants";
import {ReviewStatus} from "../../constants/status.constants";

const saved_Application = {
    id: "uuid",
    userId: "uuid",
    applicantId: "uuid",
    cycleId: "uuid",
    stepNumber: 1,
    teammates: [{personId: "uuid"}],
    teamMateInvites: [
        {email: "inthrak04@gmail.com", inviteAs: InviteAs.TEAMMATE},
    ],
    cycle: {
        name: "Cycle 123",
        program: {
            name: "ProgramName",
        },
    },
    basicDetails: {
        title: "AI-powered Healthcare Assistant",
        summary: "An AI system that helps doctors with faster diagnostics.",
        problem: "Healthcare diagnostics are slow and error-prone.",
        solution: "Use AI algorithms to assist in diagnosis and reduce errors.",
        innovation:
            "First system integrating AI and IoT for real-time diagnostics.",
    },
};

const dummyVerification = {
    id: "f1b23580-b77e-456e-86dc-0f4f6a3a9b22",
    token: "hashed_token_string_here", // stored as hash, not raw token
    validTill: new Date("2025-10-13T10:00:00.000Z"),
    validatedAt: null,
};

const dummyUserInvite = {
    id: "c18e3d10-2f51-4cb8-9d3f-37bdbb6c9e9e",
    inviteAs: "REVIEWER",
    status: "SENT",
    email: "jane.doe@example.com",
    applicationId: "7f6d8a60-9b56-43c9-bc21-d4e6f16fd3af",
    application: {
        id: "7f6d8a60-9b56-43c9-bc21-d4e6f16fd3af",
        title: "Community Development Grant",
        applicantId: "1bceef67-ff26-42ab-b7ab-3e12f1f26ef5",
    } as any, // mock GrantApplication reference
    verificationId: "f1b23580-b77e-456e-86dc-0f4f6a3a9b22",
    verification: dummyVerification,
    createdAt: new Date("2025-10-06T09:45:00.000Z"),
    updatedAt: new Date("2025-10-06T09:45:00.000Z"),
};

const createReviewMock = {
    id: "review-uuid",
    applicationId: "application-uuid",
    reviewerId: "reviewer-uuid",
};

const SAVED_USER = {
    personId: "user-123",
    person: {
        id: "user-123",
        firstName: "John",
        lastName: "Doe",
        password_hash: "hashed_password_123",
    },
    status: "ACTIVE",
    role: ["NORMAL_USER"],
    commitment: "ACTIVE",
    contact: {
        email: "john.doe@example.com",
        phone: "+1-555-1234",
        address: "123 Main Street, Springfield, USA",
    },
    audit: {
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-10T15:30:00.000Z",
    },
    experiences: [
        {
            company: "Acme Corp",
            position: "Software Engineer",
            startDate: "2020-01-01T00:00:00.000Z",
            description: "Worked on backend services",
            endDate: "2022-06-01T00:00:00.000Z",
        },
        {
            company: "Tech Solutions",
            position: "Senior Developer",
            startDate: "2022-07-01T00:00:00.000Z",
            description: "Leading a small dev team",
            endDate: null,
        },
    ],
    tokenVersion: 1,
    createdAt: "2024-01-01T10:00:00.000Z",
    updatedAt: "2024-01-10T15:30:00.000Z",
};

const mockProjectReview = {
    id: "a3e2cb42-7b19-4cb1-9ef3-9d8c3148c111",
    status: ReviewStatus.IN_PROGRESS,
    recommendation: "APPROVE",
    reviewAnalysis:
        "The project meets all required criteria and shows strong execution.",
    reviewerId: "d9c22a54-3f1a-4c3e-92cd-b725dabcd111",
    reviewer: {
        id: "d9c22a54-3f1a-4c3e-92cd-b725dabcd111",
        name: "John Doe",
        email: "john.doe@example.com",
        // ...other User properties
    },
    submissionId: "f1b9ac33-9dc9-4e21-9a1d-55abca9f9222",
    reviewSubmission: {
        id: "f1b9ac33-9dc9-4e21-9a1d-55abca9f9222",
        // ...other CycleAssessmentAggregate properties
    },
    slug: "project-review-001",
    createdAt: new Date("2024-02-01T12:00:00Z"),
    updatedAt: new Date("2024-02-01T12:05:00Z"),
};

const mockCycleAssessment = {
    id: "11111111-2222-3333-4444-555555555555",

    criteriaId: "criteria-123",
    criteria: {
        id: "criteria-123",
        name: "Compliance",
        description: "Ensures project meets required compliance metrics",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    projectId: "project-321",
    project: {
        id: "project-321",
        name: "AI Research Project",
        description: "A project focused on building AI solutions.",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    reviewBrief: "Initial assessment of the project.",

    reviewDocument: {
        title: "Project Overview",
        description: "Summary of project goals and objectives.",
        fileName: "overview.pdf",
        fileSize: 204800,
        mimeType: "application/pdf",
        storageUrl: "https://storage.example.com/files/overview.pdf",
        metaData: {uploadedBy: "test_user"},
    },

    slug: "cycle-assessment-ai-research",

    reviews: [
        {
            id: "rev-1",
            status: "IN_PROGRESS",
            recommendation: null,
            reviewAnalysis: "Good structure but needs refinement.",
            reviewerId: "user-123",
            reviewer: {
                id: "user-123",
                name: "John Reviewer",
                email: "john@example.com",
            },
            submissionId: "11111111-2222-3333-4444-555555555555",
            reviewSubmission: undefined, // avoid circular reference
            slug: "review-1",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],

    createdAt: new Date(),
    updatedAt: new Date(),
};

export {
    dummyUserInvite,
    saved_Application,
    createReviewMock,
    SAVED_USER,
    mockProjectReview,
    mockCycleAssessment,
};
