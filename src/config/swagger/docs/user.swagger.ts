export const USER_RESPONSES = {
  GET_ACCOUNT: {
    SUCCESS: {
      status: 200,
      description: "User account details fetched successfully",
      example: {
        status: 200,
        message: "User Account Fetched",
        res: {
          user: {
            id: "uuid",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            role: ["USER"],
            createdAt: "2025-09-20T10:00:00.000Z",
            updatedAt: "2025-09-20T10:00:00.000Z",
          },
        },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "User not found",
      example: {
        status: 404,
        message: "User Not Found",
        res: null,
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while fetching user account",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};
