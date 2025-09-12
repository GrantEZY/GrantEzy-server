const USERS_ARRAY = [
    {
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
            email: "tylerdurden@gmail.com",
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
    },
    {
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
            email: "tylerdurden@gmail.com",
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
    },
    {
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
            email: "tylerdurden@gmail.com",
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
    },
    {
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
            email: "tylerdurden@gmail.com",
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
    },
];

const GET_USERS_FETCH = {
    page: 2,
    numberOfResults: 4,
    filter: {role: "NORMAL_USER"},
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

export {USERS_ARRAY, GET_USERS_FETCH, SAVED_USER};
