export const GET_GCV_MEMBERS = {
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

export const ADD_GCV_USERS = {
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
              id:"uuid",
              email: "tylerdurden@gmail.com",
            },
        },
    },
};


export const UPDATE_GCV_USER_ROLE = {
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

export const PROGRAM_RESPONSES = {
  CREATE: {
    SUCCESS: {
      status: 201,
      description: "Program created successfully",
      res: {
        organizationId: "uuid",
        name: "AI Innovation Program",
        id: "uuid",
      },
    },
    ORGANIZATION_NOT_FOUND: {
      status: 400,
      description: "Organization not found",
      res: null,
    },
    TRYING_TO_CREATE_ALREADY_EXISTING_ORG: {
      status: 409,
      description: "Organization with this name already exists",
      res: null,
    },
  },

  FETCH: {
    SUCCESS: {
      status: 200,
      description: "Programs fetched successfully as per filter",
      res: {
        programs: ["ARRAY OF PROGRAMS"],
        numberOfPrograms: 2,
      },
    },
  },

  UPDATE: {
    SUCCESS: {
      status: 200,
      description: "Program updated successfully",
      res: {
        id: "uuid",
        status: "ACTIVE",
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Program not found",
      res: null,
    },
      NAME_ALREADY_TAKEN: {
      status: 409,
      description: "Program name already exist in organization",
      res: null,
    },
  },

  DELETE: {
    SUCCESS: {
      status: 200,
      description: "Program deleted successfully",
      res: {
        success: true,
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Program not found",
      res: null,
    },
    FAILURE: {
      status: 400,
      description: "Error in deleting Program",
      res: null,
    },
  },

  ADD_MANAGER: {
    SUCCESS: {
      status: 200,
      description: "Program Manager added successfully",
      res: {
        managerId: "uuid",
        programId: "uuid",
      },
    },
    USER_NOT_FOUND: {
      status: 404,
      description: "User not found",
      res: null,
    },
    PROGRAM_NOT_FOUND: {
      status: 404,
      description: "Program not found",
      res: null,
    },
    MANAGER_ALREADY_LINKED: {
      status: 409,
      description: "Manager already has a program",
      res: null,
    },
    FAILURE: {
      status: 400,
      description: "Error in adding Program Manager",
      res: null,
    },
  },

  UPDATE_MANAGER: {
    SUCCESS: {
      status: 200,
      description: "Program Manager updated successfully",
      res: {
        managerId: "uuid",
        programId: "uuid",
      },
    },
    FAILURE: {
      status: 400,
      description: "Error in updating Program Manager",
      res: null,
    },
  },
};




