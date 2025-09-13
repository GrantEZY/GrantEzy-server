export const RegisterSwagger = {
    SUCCESS: {
        status: 201,
        description: "The user has been successfully created.",
        example: {
            status: 201,
            message: "User registered successfully",
            res: {
                id: "uuid",
                email: "tylerdurden@gmail.com",
            },
        },
    },
    CONFLICT: {
        status: 409,
        description: "Forbidden Request.",
        example: {
            status: 409,
            message: "User already exists",
            res: null,
        },
    },
};

export const LoginSwagger = {
    SUCCESS: {
        status: 200,
        description: "Login Successful",
        example: {
            status: 200,
            message: "Login Successful",
            res: {
                accessToken: "Accesstoken for other routes",
                email: "tylerdurden@gmail.com",
                role: "normal",
                id: "uuid",
                name: "tylerdurden ",
            },
        },
    },
    USER_NOT_FOUND: {
        status: 401,
        description: "User Not Found",
        example: {
            status: 401,
            message: "User Not Found",
            res: null,
        },
    },
    PASSWORD_DONT_MATCH: {
        status: 402,
        description: "Password don't match",
        example: {
            status: 401,
            message: "Password is incorrect",
            res: null,
        },
    },
    USER_DONT_HAVE_THE_ROLE: {
        status: 403,
        description: "User doesn't have access to that role",
        example: {
            status: 401,
            message: "User doesn't have access to that role",
            res: null,
        },
    },
};

export const LogoutSwagger = {
    SUCCESS: {
        status: 200,
        description: "Successful Logout",
        example: {
            status: 200,
            message: "Logout Successful",
            res: null,
        },
    },
};

export const RefreshSwagger = {
    SUCCESS: {
        status: 200,
        description: "Access Token Successfully created",
        example: {
            status: 200,
            message: "Access Token Created",
            res: "userData",
        },
    },

    USER_NOT_FOUND: {
        status: 401,
        description: "User not found",
        example: {
            status: 401,
            message: "User not found",
            res: null,
        },
    },
    TOKEN_MISMATCH: {
        status: 403,
        description: "Token mismatch",
        example: {
            status: 401,
            message: "Token mismatch",
            res: null,
        },
    },
};
