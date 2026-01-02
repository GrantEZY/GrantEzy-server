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
        status: 404,
        description: "User Not Found",
        example: {
            status: 404,
            message: "User Not Found",
            res: null,
        },
    },
    PASSWORD_DONT_MATCH: {
        status: 402,
        description: "Password don't match",
        example: {
            status: 404,
            message: "Password is incorrect",
            res: null,
        },
    },
    USER_DONT_HAVE_THE_ROLE: {
        status: 403,
        description: "User doesn't have access to that role",
        example: {
            status: 404,
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
        status: 404,
        description: "User not found",
        example: {
            status: 404,
            message: "User not found",
            res: null,
        },
    },
    TOKEN_MISMATCH: {
        status: 403,
        description: "Token mismatch",
        example: {
            status: 404,
            message: "Token mismatch",
            res: null,
        },
    },
};

export const ForgotPasswordSwagger = {
    SUCCESS: {
        status: 201,
        description: "Forgot Password Email Sent Successfully.",
        example: {
            status: 201,
            message: "Forgot Password Email Sent",
            res: {
                status: true,
            },
        },
    },

    USER_NOT_FOUND: {
        status: 404,
        description: "User not found for the provided email.",
        example: {
            status: 404,
            message: "User Not Found",
            res: null,
        },
    },

    EMAIL_SEND_ERROR: {
        status: 500,
        description: "Failed to add forgot password email to the queue or send email.",
        example: {
            status: 500,
            message: "Issue In Sending Email",
            res: null,
        },
    },
};


export const UpdatePasswordSwagger = {
    SUCCESS: {
        status: 204,
        description: "Password updated successfully.",
        example: {
            status: 204,
            message: "Password Updated",
            res: {
                status: true,
            },
        },
    },

    TOKEN_INVALID: {
        status: 403,
        description: "The provided reset token is invalid or expired.",
        example: {
            status: 403,
            message: "Token is not valid",
            res: null,
        },
    },

    FORGOT_REQUEST_NOT_FOUND: {
        status: 404,
        description: "Forgot password request not initiated or not found for the given slug.",
        example: {
            status: 404,
            message: "Forgot Password Request Not Initiated",
            res: null,
        },
    },

    USER_NOT_FOUND: {
        status: 404,
        description: "No user found for the provided forgot password request.",
        example: {
            status: 404,
            message: "User Not Found",
            res: null,
        },
    },

    UNKNOWN_ERROR: {
        status: 500,
        description: "An unknown server error occurred while updating password.",
        example: {
            status: 500,
            message: "Unknown Error",
            res: null,
        },
    },
};

