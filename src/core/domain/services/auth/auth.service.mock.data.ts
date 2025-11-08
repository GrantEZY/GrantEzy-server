import {UserCommitmentStatus} from "../../constants/commitment.constants";
import {UserRoles} from "../../constants/userRoles.constants";

const REGISTER_USER = {
    firstName: "Tyler",
    lastName: "Durden",
    email: "tylerdurden@gmail.com",
    password: "8765AbCd@123",
    commitment: UserCommitmentStatus.FULL_TIME,
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

const LOGIN_DATA = {
    email: "tyler@gmail.com",
    password: "8765abcd@123",
    role: UserRoles.ADMIN,
};

const dummyVerification = {
    id: "f1b23580-b77e-456e-86dc-0f4f6a3a9b22",
    token: "hashed_token_string_here", // stored as hash, not raw token
    validTill: new Date("2027-10-13T10:00:00.000Z"),
    validatedAt: null,
};

const ForgotPasswordEntity = {
    id: "c18e3d10-2f51-4cb8-9d3f-37bdbb6c9e9e",
    email: "jane.doe@example.com",
    verificationId: "f1b23580-b77e-456e-86dc-0f4f6a3a9b22",
    verification: dummyVerification,
    createdAt: new Date("2025-10-06T09:45:00.000Z"),
    updatedAt: new Date("2025-10-06T09:45:00.000Z"),
};

export {REGISTER_USER, SAVED_USER, LOGIN_DATA, ForgotPasswordEntity};
