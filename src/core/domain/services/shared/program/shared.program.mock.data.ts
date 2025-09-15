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

export {PROGRAMS_ARRAY, SAVED_PROGRAM, NEW_PROGRAM_DATA};
