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
      message: "No Users Found",
      res: {
        users: [],
        totalNumberOfUsers: 0,
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
    status: 200,
    description: "User Already Found And Role Added",
    example: {
      status: 200,
      message: "User Already Found And Role Added",
      res: {
        id: "uuid",
        email: "tylerdurden@gmail.com",
      },
    },
  },
  ERROR_IN_ADDING_ROLE: {
    status: 400,
    description: "Error in Adding Role to Existing User",
    example: {
      status: 400,
      message: "Error in Adding Role to Existing User",
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

export const ORGANIZATION_RESPONSES = {
  CREATE: {
    SUCCESS: {
      status: 200,
      description: "Organization created successfully",
      example: {
        status: 200,
        message: "Organization created successfully",
        res: {
          id: "uuid",
          name: "Organisation Name",
          type: "IIT",
        },
      },
    },
    ORGANISATION_ALREADY_FOUND: {
      status: 400,
      description: "Organization with this name already exists",
      example: {
        status: 400,
        message: "Organization with this name already exists",
        res: null,
      },
    },
  },

  GET_ALL: {
    SUCCESS: {
      status: 200,
      description: "Organizations fetched successfully",
      example: {
        status: 200,
        message: "Organizations fetched successfully",
        res: {
          organizations: [
            {
              id: "uuid",
              name: "Organisation Name",
              type: "IIT",
            },
          ],
        },
      },
    },
  },

  DELETE: {
    SUCCESS: {
      status: 200,
      description: "Organization deleted successfully",
      example: {
        status: 200,
        message: "Organization deleted successfully",
        res: { success: true },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Organization not found",
      example: {
        status: 404,
        message: "Organization not found",
        res: null,
      },
    },
  },

  UPDATE: {
    SUCCESS: {
      status: 200,
      description: "Organization updated successfully",
      example: {
        status: 200,
        message: "Organization updated successfully",
        res: {
          id: "uuid",
          name: "Organisation Name",
          type: "IIT",
        },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Organization not found",
      example: {
        status: 404,
        message: "Organization not found",
        res: null,
      },
    },
  },
};

export const USER_PROFILE = {
  SUCCESS: {
    status: 200,
    description: "User Profile Admin View",
    example: {
      status: 200,
      message: "User Profile",
      res: {
        user: "Profile Object",
      },
    },
  },
};
