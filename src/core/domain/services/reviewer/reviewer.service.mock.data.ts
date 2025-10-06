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

const dummyVerification = {
    id: "f1b23580-b77e-456e-86dc-0f4f6a3a9b22",
    token: "hashed_token_string_here", // stored as hash, not raw token
    validTill: new Date("2025-10-13T10:00:00.000Z"),
    validatedAt: null,
};

const dummyUserInvite = {
    id: "c18e3d10-2f51-4cb8-9d3f-37bdbb6c9e9e",
    inviteAs: "CO_APPLICANT",
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

export {dummyUserInvite, saved_Application};
