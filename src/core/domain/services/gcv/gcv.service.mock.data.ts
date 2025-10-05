import {OrganisationType} from "../../constants/organization.constants";
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

const NEW_PROGRAM_DATA = {
    organization: {
        name: "Test Organization",
        type: "IIT",
        isNew: false,
    },
    details: {
        name: "AI Innovation Challenge",
        description: "A program to fund AI research in startups and academia",
        category: "Research",
    },
    duration: {
        startDate: "2025-01-01T00:00:00Z",
        endDate: "2025-12-31T23:59:59Z",
    },
    status: "ACTIVE",
    budget: {
        amount: 1000000,
        currency: "USD",
    },
    minTRL: "TRL_3",
    maxTRL: "TRL_7",
};

const SAVED_PROGRAM = {
    id: "org-123",
    organizationId: "org-1234-5678-90ab-cdef12345678",
    details: {
        name: "AI Innovation Challenge",
        description:
            "A program to fund cutting-edge AI startups focusing on healthcare and sustainability.",
        category: "Artificial Intelligence",
    },
    duration: {
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-12-31T23:59:59.000Z",
    },
    status: "ACTIVE",
    budget: {
        amount: 500000,
        currency: "USD",
    },
    minTRL: "TRL_3",
    maxTRL: "TRL_7",
    slug: "ai-innovation-challenge-a12f3b45",
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-02-15T15:30:00.000Z",
};

const SAVED_ORGANIZATION = {
    id: "org-1234-5678-90ab-cdef12345678",
    name: "Test Organization",
    type: OrganisationType.IIIT,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const CYCLES_ARRAY = [
    {
        id: "uuid",
        programId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
        round: {
            year: 2025,
            type: "Spring",
        },
        budget: {
            amount: 500000,
            currency: "USD",
        },
        duration: {
            startDate: "2025-01-01T00:00:00Z",
            endDate: "2025-06-30T23:59:59Z",
        },
        trlCriteria: {
            TRL_1: {
                requirements: ["Understand basic principles"],
                evidence: ["Research whitepaper"],
                metrics: ["Readiness index"],
            },
            TRL_2: {
                requirements: ["Proof of concept demonstrated"],
                evidence: ["Prototype demo"],
                metrics: ["Prototype performance"],
            },
        },
        scoringScheme: {
            technical: {minScore: 1, maxScore: 10, weightage: 0.3},
            market: {minScore: 1, maxScore: 10, weightage: 0.25},
            financial: {minScore: 1, maxScore: 10, weightage: 0.2},
            team: {minScore: 1, maxScore: 10, weightage: 0.15},
            innovation: {minScore: 1, maxScore: 10, weightage: 0.1},
        },
    },
    {
        programId: "6c91f2e1-2b3c-4d4a-8f6a-7b9d2a1c8e22",
        round: {
            year: 2025,
            type: "Fall",
        },
        budget: {
            amount: 750000,
            currency: "EUR",
        },
        duration: {
            startDate: "2025-07-01T00:00:00Z",
            endDate: "2025-12-31T23:59:59Z",
        },
        trlCriteria: {
            TRL_1: {
                requirements: ["Identify fundamental concept"],
                evidence: ["Initial research document"],
                metrics: ["Concept validation score"],
            },
            TRL_3: {
                requirements: ["Validated in lab environment"],
                evidence: ["Lab experiment results"],
                metrics: ["Success rate"],
            },
        },
        scoringScheme: {
            technical: {minScore: 1, maxScore: 10, weightage: 0.25},
            market: {minScore: 1, maxScore: 10, weightage: 0.25},
            financial: {minScore: 1, maxScore: 10, weightage: 0.2},
            team: {minScore: 1, maxScore: 10, weightage: 0.15},
            innovation: {minScore: 1, maxScore: 10, weightage: 0.15},
        },
    },
];

const saved_Application = {
    id: "uuid",
    userId: "uuid",
    applicantId: "uuid",
    cycleId: "uuid",
    stepNumber: 1,
    teamMateInvites: [{email: "inthrak04@gmail.com"}],
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

const PROGRAMS_ARRAY = [SAVED_PROGRAM, SAVED_PROGRAM, SAVED_PROGRAM];

export {
    SAVED_USER,
    NEW_PROGRAM_DATA,
    SAVED_ORGANIZATION,
    SAVED_PROGRAM,
    PROGRAMS_ARRAY,
    CYCLES_ARRAY,
    saved_Application,
};
