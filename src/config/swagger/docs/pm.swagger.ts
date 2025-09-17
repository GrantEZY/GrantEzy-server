export const CYCLE_RESPONSES = {
  CREATE: {
    SUCCESS: {
      status: 201,
      description: "Cycle created successfully for the program",
      schema: {
        example: {
          status: 201,
          message: "Cycle Created for Program",
          res: {
            programId: "uuid-of-program",
            cycleId: "uuid-of-cycle",
          },
        },
      },
    },
    PROGRAM_NOT_FOUND: {
      status: 404,
      description: "The program with the given ID was not found",
      schema: {
        example: {
          status: 404,
          message: "Program Not Found",
          res: null,
        },
      },
    },
    BUDGET_EXCEEDS: {
      status: 400,
      description: "Quoted budget exceeds the available program limit",
      schema: {
        example: {
          status: 400,
          message: "Quoted Budget exceeds the available limit for the program",
          res: null,
        },
      },
    },
  },

  DELETE: {
    SUCCESS: {
      status: 200,
      description: "The cycle has been deleted",
      schema: {
        example: {
          status: 200,
          message: "Cycle Deleted Successfully",
          res: {
            status: true,
          },
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The cycle with the given ID was not found",
      schema: {
        example: {
          status: 404,
          message: "Cycle Not Found",
          res: null,
        },
      },
    },
  },

  PROGRAM_CYCLES_READ: {
    SUCCESS: {
      status: 200,
      description: "Paginated filter for the program cycles",
      schema: {
        example: {
          status: 200,
          message: "Program cycles fetched",
          res: {
            cycles: "ARRAY OF CYCLES",
            totalNumberOfCycles: 3,
          },
        },
      },
    },
  },

  UPDATE: {
    SUCCESS: {
      status: 200,
      description: "Cycle details updated",
      schema: {
        example: {
          status: 200,
          message: "Cycle Details Updated",
          res: {
            id: "Cycle Id",
            status: true,
          },
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The cycle with the given ID was not found",
      schema: {
        example: {
          status: 404,
          message: "Cycle Not Found",
          res: null,
        },
      },
    },
  },
};
