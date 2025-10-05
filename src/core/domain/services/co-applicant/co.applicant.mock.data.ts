import {InviteAs} from "../../constants/invite.constants";

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

export {saved_Application};
