const SAVED_PROGRAM = {
    id: "org-123",
    organizationId: "org-1234-5678-90ab-cdef12345678",
    organization: {
        name: "orgname",
    },
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

const PROGRAMS_ARRAY = [SAVED_PROGRAM, SAVED_PROGRAM, SAVED_PROGRAM];

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

const inputCycle = {
    id: "cycle-id",
    programId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    round: {
        year: 2025,
        type: "Fall",
    },
    budget: {
        amount: 750000,
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
        TRL_3: {
            requirements: ["Validated in lab environment"],
            evidence: ["Lab experiment results"],
            metrics: ["Success rate"],
        },
    },
    scoringScheme: {
        technical: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.3,
        },
        market: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.25,
        },
        financial: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.2,
        },
        team: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.15,
        },
        innovation: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.1,
        },
    },
};

const CYCLES_ARRAY = [
    {
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

export {
    PROGRAMS_ARRAY,
    SAVED_PROGRAM,
    NEW_PROGRAM_DATA,
    inputCycle,
    CYCLES_ARRAY,
};
