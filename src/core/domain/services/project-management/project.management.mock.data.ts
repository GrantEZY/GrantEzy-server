import {TRL} from "../../constants/trl.constants";
const saved_Application = {
    id: "uuid",
    userId: "uuid",
    applicantId: "uuid",
    cycleId: "uuid",
    stepNumber: 1,
    applicant: {
        personId: "applicantId",
        contact: {
            email: "email",
        },
    },
    teammates: [{personId: "uuid"}],
    teamMateInvites: [{email: "inthrak04@gmail.com", inviteAs: "TEAMMATE"}],
    cycle: {
        name: "Cycle 123",
        isApplicationAccepted: true,
        slug: "slug",
        program: {
            name: "ProgramName",
            managerId: "uuid",
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

const saved_project = {
    id: "uuid",
    allotedBudget: {
        ManPower: {
            currency: "IND",
            value: 400,
        },
    },
};

const createProjectData = {
    applicationId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    allocatedBudget: {
        ManPower: [
            {
                BudgetReason: "Hiring developers",
                Budget: {
                    amount: 200000,
                    currency: "INR",
                },
            },
        ],
        Equipment: [
            {
                BudgetReason: "GPU Servers",
                Budget: {
                    amount: 150000,
                    currency: "INR",
                },
            },
        ],
        OtherCosts: [],
        Consumables: {
            BudgetReason: "Cloud credits",
            Budget: {
                amount: 50000,
                currency: "INR",
            },
        },
        Travel: {
            BudgetReason: "Conferences",
            Budget: {
                amount: 20000,
                currency: "INR",
            },
        },
        Contigency: {
            BudgetReason: "Unexpected costs",
            Budget: {
                amount: 30000,
                currency: "INR",
            },
        },
        Overhead: {
            BudgetReason: "Admin expenses",
            Budget: {
                amount: 50000,
                currency: "INR",
            },
        },
    },
    plannedDuration: {
        startDate: "2025-10-29T11:24:05.218Z",
        endDate: "2025-10-29T11:24:05.218Z",
    },
};

const dummyCycle = {
    id: "uuid",
    programId: "f3d2a8c1-7d8e-4b2a-93b6-1d3e5f8a9c11",
    program: {
        details: {
            name: "Program",
        },
        managerId: "uuid",
    },
    round: {
        year: 2025,
        type: "Spring",
    },
    budget: {
        amount: 500000,
        currency: "USD",
    },
    duration: {
        startDate: new Date("2025-01-01T00:00:00.000Z"),
        endDate: new Date("2025-06-30T23:59:59.000Z"),
    },
    trlCriteria: {
        [TRL.TRL1]: {
            requirements: "Basic principles observed",
            evidence: "Research papers, theoretical analysis",
            metrics: "Number of peer-reviewed publications",
        },
        [TRL.TRL2]: {
            requirements: "Technology concept formulated",
            evidence: "Lab notes, whitepapers",
            metrics: "Proof-of-concept reports",
        },
        [TRL.TRL3]: {
            requirements: "Experimental proof of concept",
            evidence: "Lab prototype, simulations",
            metrics: "Successful experiment counts",
        },
    },
    scoringScheme: {
        technical: {
            weight: 0.3,
            criteria: "Feasibility of the technology",
        },
        market: {
            weight: 0.25,
            criteria: "Market potential and fit",
        },
        financial: {
            weight: 0.2,
            criteria: "Funding viability and cost structure",
        },
        team: {
            weight: 0.15,
            criteria: "Team expertise and execution ability",
        },
        innovation: {
            weight: 0.1,
            criteria: "Novelty and differentiation",
        },
    },
    applications: [], // Could later contain GrantApplication[]
    slug: "spring-2025-cycle",
    createdAt: new Date(),
    updatedAt: new Date(),
};

const dummyCycleAssessmentCriteria = {
    id: "c1d5d0a3-9d99-4b29-9efb-3b724c1a8c11",
    name: "Design Quality Review",
    cycleId: "cycle-12345",
    reviewBrief:
        "Assess the overall design quality and UX compliance of the product module.",
    createdAt: new Date("2025-11-01T10:00:00Z"),
    updatedAt: new Date("2025-11-05T14:30:00Z"),
    slug: "design-quality-review",
};

const createCriteriaData = {
    cycleId: "3f9b7b9e-d33b-4a7b-bc2a-1234567890aa",
    name: "Cycle Spring Review",
    briefReview: "Assess project readiness for public beta release.",
    templateFile: {
        title: "Beta Readiness Checklist",
        fileName: "beta_checklist.docx",
        fileSize: "820KB",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        storageUrl: "https://storage.example.com/docs/beta_checklist.docx",
        metaData: {reviewer: "John Doe", version: "1.1"},
    },
};

export {
    saved_Application,
    saved_project,
    createProjectData,
    dummyCycle,
    dummyCycleAssessmentCriteria,
    createCriteriaData,
};
