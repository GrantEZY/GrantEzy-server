export const GET_ALL_USERS = {
    SUCCESS: {
        status: 200,
        description: "User Successfully Fetched",
        example: {
            status: 200,
            message: "User Data for Filter",
            res: {
                users: "User Data",
                totalNumberOfUsers: 101,
            },
        },
    },

    NO_USERS_PRESENT: {
        status: 200,
        description: "Users Not Found",
        example: {
            status: 200,
            message: "User Data for Filter",
            res: {
                users: "Empty Array",
                totalNumberOfUsers: 101,
            },
        },
    },
};

export const ADD_USERS = {
    SUCCESS: {
        status: 201,
        description: "User Added Successfully",
        example: {
            status: 201,
            message: "User Added Successfully",
            res: {
                id: "uuid",
                email: "tylerdurden@gmail.com",
            },
        },
    },
    USER_ALREADY_PRESENT: {
        status: 400,
        description: "User Already Found",
        example: {
            status: 400,
            message: "User Already Found",
            res: null,
        },
    },
};

export const UPDATE_USER_ROLE = {
    SUCCESS: {
        status: 204,
        description: "User Role Updated",
        example: {
            status: 204,
            message: "User role Updated",
            res: {
                id: "uuid",
                role: "ADMIN",
            },
        },
    },
    ALREADY_ROLE_LINKED: {
        status: 401,
        description: "User already has the role privileges",
        example: {
            status: 401,
            message: "User already has the role privileges",
            res: null,
        },
    },
};

export const DELETE_USER = {
    SUCCESS: {
        status: 200,
        description: "User Deleted Successfully",
        example: {
            status: 200,
            message: "User Deleted Successfully",
            res: {
                status: true,
            },
        },
    },
    USER_NOT_FOUND: {
        status: 400,
        description: "User Not Found",
        example: {
            status: 400,
            message: "User Not Found",
            res: null,
        },
    },
};
