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

export {SAVED_USER, NEW_PROGRAM_DATA, SAVED_ORGANIZATION, SAVED_PROGRAM};
