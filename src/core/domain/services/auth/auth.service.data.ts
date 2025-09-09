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

export {REGISTER_USER, SAVED_USER, LOGIN_DATA};
