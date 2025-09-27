import {InviteStatus} from "../../constants/invite.constants";

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
    applicantId: "uuid",
    cycleId: "uuid",
    stepNumber: 1,
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

const InviteArray = [
    {email: "inthrak04@gmail.com", status: InviteStatus.SENT},
    {email: "tylerdurden@gmail.com", status: InviteStatus.SENT},
];

const applicationsArray = [
    saved_Application,
    saved_Application,
    saved_Application,
];

const budgetAndTechnicalDetails = {
    applicationId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    budget: {
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
};

const applicationTechnicalAndMarketInfoDetails = {
    applicationId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    technicalSpec: {
        description: "An AI-powered health monitoring device",
        techStack: ["Node.js", "TensorFlow", "React"],
        prototype: "https://github.com/example/prototype",
    },
    marketInfo: {
        totalAddressableMarket: "500M users worldwide",
        serviceableMarket: "200M users in APAC region",
        obtainableMarket: "50M users initially",
        competitorAnalysis: "Competitor A has 60% market share",
    },
};

const applicationDocuments = {
    applicationId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    endorsementLetter: {
        title: "Endorsement Letter",
        description: "Letter signed by the head of institution",
        fileName: "endorsement_letter.pdf",
        fileSize: "2MB",
        mimeType: "application/pdf",
        storageUrl: "https://storage.example.com/docs/endorsement_letter.pdf",
        metaData: {
            issuedBy: "Institute Head",
            date: "2025-01-01",
        },
    },
    plagiarismUndertaking: {
        title: "Endorsement Letter",
        description: "Letter signed by the head of institution",
        fileName: "endorsement_letter.pdf",
        fileSize: "2MB",
        mimeType: "application/pdf",
        storageUrl: "https://storage.example.com/docs/endorsement_letter.pdf",
        metaData: {
            issuedBy: "Institute Head",
            date: "2025-01-01",
        },
    },
    ageProof: {
        title: "Endorsement Letter",
        description: "Letter signed by the head of institution",
        fileName: "endorsement_letter.pdf",
        fileSize: "2MB",
        mimeType: "application/pdf",
        storageUrl: "https://storage.example.com/docs/endorsement_letter.pdf",
        metaData: {
            issuedBy: "Institute Head",
            date: "2025-01-01",
        },
    },
    aadhar: {
        title: "Endorsement Letter",
        description: "Letter signed by the head of institution",
        fileName: "endorsement_letter.pdf",
        fileSize: "2MB",
        mimeType: "application/pdf",
        storageUrl: "https://storage.example.com/docs/endorsement_letter.pdf",
        metaData: {
            issuedBy: "Institute Head",
            date: "2025-01-01",
        },
    },
    piCertificate: {
        title: "Endorsement Letter",
        description: "Letter signed by the head of institution",
        fileName: "endorsement_letter.pdf",
        fileSize: "2MB",
        mimeType: "application/pdf",
        storageUrl: "https://storage.example.com/docs/endorsement_letter.pdf",
        metaData: {
            issuedBy: "Institute Head",
            date: "2025-01-01",
        },
    },
    coPiCertificate: {
        title: "Endorsement Letter",
        description: "Letter signed by the head of institution",
        fileName: "endorsement_letter.pdf",
        fileSize: "2MB",
        mimeType: "application/pdf",
        storageUrl: "https://storage.example.com/docs/endorsement_letter.pdf",
        metaData: {
            issuedBy: "Institute Head",
            date: "2025-01-01",
        },
    },
    otherDocuments: [
        {
            title: "Endorsement Letter",
            description: "Letter signed by the head of institution",
            fileName: "endorsement_letter.pdf",
            fileSize: "2MB",
            mimeType: "application/pdf",
            storageUrl:
                "https://storage.example.com/docs/endorsement_letter.pdf",
            metaData: {
                issuedBy: "Institute Head",
                date: "2025-01-01",
            },
        },
    ],
};

const addApplicationTeamMates = {
    applicationId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    emails: ["alice@example.com", "bob@example.com"],
    isSubmitted: false,
};

const revenueDetails = {
    applicationId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    revenueModel: {
        primaryStream: {
            type: "SUBSCRIPTION",
            description: "Monthly subscription fee",
            percentage: 70,
        },
        secondaryStreams: [
            {
                type: "SUBSCRIPTION",
                description: "Monthly subscription fee",
                percentage: 70,
            },
        ],
        pricing: "Freemium with premium upgrades",
        unitEconomics: "LTV > CAC, payback period of 6 months",
    },
};

const riskAndMileStones = {
    applicationId: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    risks: [
        {
            description: "Vendor lock-in due to cloud provider dependency",
            impact: "HIGH",
            mitigation: "Use a multi-cloud strategy",
        },
    ],
    milestones: [
        {
            title: "MVP Release",
            description: "Deliver the MVP with core features",
            deliverables: ["Auth module", "Dashboard"],
            status: "IN_PROGRESS",
            dueDate: "2025-12-31T00:00:00.000Z",
            completedDate: null,
        },
    ],
};

export {
    dummyApplicantData,
    saved_Application,
    cycleData,
    addApplicationTeamMates,
    applicationTechnicalAndMarketInfoDetails,
    applicationDocuments,
    applicationsArray,
    budgetAndTechnicalDetails,
    revenueDetails,
    riskAndMileStones,
    InviteArray,
};
