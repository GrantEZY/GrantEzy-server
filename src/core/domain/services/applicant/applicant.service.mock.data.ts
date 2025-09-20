const dummyApplicantData = {
    cycleSlug: "4b7d1f330f2e4b7a91e35f58f3c9d4ab",
    basicInfo: {
        title: "AI-powered Healthcare Assistant",
        summary: "An AI system that helps doctors with faster diagnostics.",
        problem:
            "Healthcare diagnostics are often slow, expensive, and error-prone.",
        solution:
            "Implement an AI-driven assistant that analyzes medical records and test results in real-time.",
        innovation:
            "Integrates AI with IoT-enabled medical devices for real-time diagnostics and personalized treatment recommendations.",
    },
};

const saved_Application = {
    id: "uuid",
    userId: "uuid",
    cycleId: "uuid",
    basicInfo: {
        title: "AI-powered Healthcare Assistant",
        summary: "An AI system that helps doctors with faster diagnostics.",
        problem: "Healthcare diagnostics are slow and error-prone.",
        solution: "Use AI algorithms to assist in diagnosis and reduce errors.",
        innovation:
            "First system integrating AI and IoT for real-time diagnostics.",
    },
};

const cycleData = {
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
};

const applicationsArray = [
    saved_Application,
    saved_Application,
    saved_Application,
];

export {dummyApplicantData, saved_Application, cycleData, applicationsArray};
