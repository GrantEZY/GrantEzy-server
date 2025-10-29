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

export {saved_Application, saved_project, createProjectData};
