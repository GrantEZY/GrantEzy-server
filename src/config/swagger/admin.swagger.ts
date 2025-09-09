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
            status: 201,
            message: "User Already Found",
            res: null,
        },
    },
};
