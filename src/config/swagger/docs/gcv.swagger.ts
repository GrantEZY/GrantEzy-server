export const GCV_RESPONSES = {
  ADD_MEMBER: {
    SUCCESS: {
      status: 200,
      description: "User added as GCV Committee Member",
      example: {
        status: 200,
        message: "User Role Added",
        res: {
          id: "uuid-of-user",
          email: "user@example.com",
        },
      },
    },
    CREATED_NEW: {
      status: 201,
      description: "New user created and added as GCV member",
      example: {
        status: 201,
        message: "User Created and Added as Committee Member",
        res: {
          id: "uuid-of-user",
          email: "user@example.com",
        },
      },
    },
    ERROR: {
      status: 400,
      description: "Error while adding user as GCV member",
      example: {
        status: 400,
        message: "Unable to add user",
        res: null,
      },
    },
  },

  GET_MEMBERS: {
    SUCCESS: {
      status: 200,
      description: "GCV members fetched successfully",
      example: {
        status: 200,
        message: "GCV Member Data for Filter",
        res: {
          users: "ARRAY OF USERS",
          totalNumberOfUsers: 101,
        },
      },
    },
    NO_USERS_PRESENT: {
      status: 200,
      description: "No GCV members found",
      example: {
        status: 200,
        message: "No User present",
        res: {
          users: [],
          totalNumberOfUsers: 0,
        },
      },
    },
  },

  UPDATE_MEMBER_ROLE: {
    SUCCESS: {
      status: 200,
      description: "User role updated successfully",
      example: {
        status: 200,
        message: "User role updated",
        res: {
          id: "uuid-of-user",
          email: "user@example.com",
          role: "COMMITTEE_MEMBER",
        },
      },
    },
    USER_NOT_FOUND: {
      status: 400,
      description: "User not found",
      example: {
        status: 400,
        message: "User Not Found",
        res: null,
      },
    },
  },

  CREATE_PROGRAM: {
    SUCCESS: {
      status: 201,
      description: "Program created successfully",
      example: {
        status: 201,
        message: "Program Created Successfully",
        res: {
          organizationId: "uuid-of-organization",
          name: "Program Name",
          id: "uuid-of-program",
        },
      },
    },
    DUPLICATE: {
      status: 409,
      description: "Organization already has a program with this name",
      example: {
        status: 409,
        message: "The Organization already has a program with this name",
        res: null,
      },
    },
  },

  GET_PROGRAMS: {
    SUCCESS: {
      status: 200,
      description: "Programs fetched as per filters",
      example: {
        status: 200,
        message: "Programs filtered as per filter",
        res: {
          programs: "ARRAY OF PROGRAMS",
          numberOfPrograms: 5,
        },
      },
    },
  },

  UPDATE_PROGRAM: {
    SUCCESS: {
      status: 200,
      description: "Program details updated successfully",
      example: {
        status: 200,
        message: "Program Updated Successfully",
        res: {
          id: "uuid-of-program",
          status: true,
        },
      },
    },
    ERROR: {
      status: 400,
      description: "Error updating program",
      example: {
        status: 400,
        message: "Error updating program",
        res: null,
      },
    },
  },

  DELETE_PROGRAM: {
    SUCCESS: {
      status: 200,
      description: "Program deleted successfully",
      example: {
        status: 200,
        message: "Program Deleted Successfully",
        res: {
          success: true,
        },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Program not found",
      example: {
        status: 404,
        message: "Program Not Found",
        res: null,
      },
    },
    ERROR: {
      status: 400,
      description: "Error deleting program",
      example: {
        status: 400,
        message: "Error in deleting Program",
        res: null,
      },
    },
  },

  ADD_PROGRAM_MANAGER: {
    SUCCESS: {
      status: 200,
      description: "Program manager added successfully",
      example: {
        status: 200,
        message: "Program Manager Added Successfully",
        res: {
          managerId: "uuid-of-manager",
          programId: "uuid-of-program",
        },
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
    PROGRAM_NOT_FOUND: {
      status: 404,
      description: "Program not found",
      example: {
        status: 404,
        message: "Program Not Found",
        res: null,
      },
    },
    MANAGER_ALREADY_ASSIGNED: {
      status: 409,
      description: "Manager already has a program assigned",
      example: {
        status: 409,
        message: "Manager already has a program",
        res: null,
      },
    },
  },

  PROGRAM_CYCLES: {
    SUCCESS: {
      status: 200,
      description: "Program cycles fetched successfully",
      example: {
        status: 200,
        message: "Program Cycle fetched successfully",
        res: {
          cycles: "ARRAY OF CYCLES",
          totalNumberOfCycles: 3,
        },
      },
    },
    NO_CYCLES_FOUND: {
      status: 404,
      description: "No cycles found for the program",
      example: {
        status: 404,
        message: "No cycles found for the program",
        res: [],
      },
    },
  },

  CYCLE_WITH_APPLICATIONS: {
    SUCCESS: {
      status: 200,
      description: "Cycle with applications fetched successfully",
      example: {
        status: 200,
        message: "Cycle Details With Applications",
        res: {
          cycle: "Cycle object with applications",
        },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Cycle not found",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },
  },

  APPLICATION_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Application details inside cycle fetched successfully",
      example: {
        status: 200,
        message: "Cycle Details With Applications",
        res: {
          application: "Application object",
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "Cycle not found",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },
    APPLICATION_NOT_FOUND: {
      status: 404,
      description: "Application not found",
      example: {
        status: 404,
        message: "Application Not Found",
        res: null,
      },
    },
    APPLICATION_MISMATCH: {
      status: 404,
      description: "Application does not belong to the given cycle",
      example: {
        status: 404,
        message: "Application Doesn't Belongs to the Cycle",
        res: null,
      },
    },
  },
};
