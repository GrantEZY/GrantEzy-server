export const CYCLE_RESPONSES = {
  CREATE: {
    SUCCESS: {
      status: 201,
      description: "Cycle created successfully for the program",
      example: {
        status: 201,
        message: "Cycle Created for Program",
        res: {
          programId: "uuid-of-program",
          cycleId: "uuid-of-cycle",
        },
      },
    },
    PROGRAM_NOT_FOUND: {
      status: 404,
      description: "The program with the given ID was not found",
      example: {
        status: 404,
        message: "Program Not Found",
        res: null,
      },
    },
    BUDGET_EXCEEDS: {
      status: 400,
      description: "Quoted budget exceeds the available program limit",
      example: {
        status: 400,
        message: "Quoted Budget exceeds the available limit for the program",
        res: null,
      },
    },
    DUPLICATE_ROUND: {
      status: 409,
      description: "Program already has a cycle with the same round",
      example: {
        status: 409,
        message: "Program has a same cycle with round",
        res: null,
      },
    },
  },

  DELETE: {
    SUCCESS: {
      status: 200,
      description: "The cycle has been deleted",
      example: {
        status: 200,
        message: "Cycle Deleted Successfully",
        res: {
          status: true,
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The cycle with the given ID was not found or already deleted",
      example: {
        status: 404,
        message: "Cycle Already Deleted",
        res: null,
      },
    },
    DELETE_ERROR: {
      status: 400,
      description: "Error occurred while deleting cycle",
      example: {
        status: 400,
        message: "Error in deleting cycle",
        res: null,
      },
    },
  },

  PROGRAM_CYCLES_READ: {
    SUCCESS: {
      status: 200,
      description: "Paginated filter for the program cycles",
      example: {
        status: 200,
        message: "Program cycles fetched",
        res: {
          cycles: "ARRAY OF CYCLES",
          totalNumberOfCycles: 3,
        },
      },
    },
    NO_CYCLES_FOUND: {
      status: 404,
      description: "No cycles available for the program",
      example: {
        status: 404,
        message: "No Cycles Found for this Program",
        res: [],
      },
    },
    CONFLICT: {
      status: 403,
      description: "Only Program Manager Can Access",
      example: {
        status: 403,
        message: "Only Program Manager can access the Program",
        res: null,
      },
    },
  },

  UPDATE: {
    SUCCESS: {
      status: 200,
      description: "Cycle details updated",
      example: {
        status: 200,
        message: "Cycle Details Updated",
        res: {
          id: "Cycle Id",
          status: true,
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The cycle with the given ID was not found",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },
  },

  CYCLE_WITH_APPLICATIONS: {
    SUCCESS: {
      status: 200,
      description: "Cycle details with applications",
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
    FORBIDDEN: {
      status: 403,
      description: "Only Program Manager can access this cycle",
      example: {
        status: 403,
        message: "Only Program Manager can access the Program",
        res: null,
      },
    },
  },

  APPLICATION_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Application details inside a cycle",
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
      description: "The cycle with the given slug was not found",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },
    APPLICATION_NOT_FOUND: {
      status: 404,
      description: "The application with the given slug was not found",
      example: {
        status: 404,
        message: "Application Not Found",
        res: null,
      },
    },
    APPLICATION_MISMATCH: {
      status: 404,
      description: "The application does not belong to the given cycle",
      example: {
        status: 404,
        message: "Application Doesn't Belongs to the Cycle",
        res: null,
      },
    },
    FORBIDDEN: {
      status: 403,
      description: "Only Program Manager can access this application",
      example: {
        status: 403,
        message: "Only Program Manager can access the Program",
        res: null,
      },
    },
  },
};
