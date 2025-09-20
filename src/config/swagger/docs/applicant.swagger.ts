export const APPLICATION_RESPONSES = {
  CREATE: {
    SUCCESS: {
      status: 201,
      description: "Application Registered Successfully",
      example: {
        status: 201,
        message: "Application Registered Successfully",
        res: {
          application: {
            id: "uuid",
            userId: "uuid",
            cycleId: "uuid",
            basicInfo: {
              title: "AI-powered Healthcare Assistant",
              summary:
                "An AI system that helps doctors with faster diagnostics.",
              problem: "Healthcare diagnostics are slow and error-prone.",
              solution: "Use AI algorithms to assist in diagnosis and reduce errors.",
              innovation: "First system integrating AI and IoT for real-time diagnostics.",
            },
          },
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "Program Cycle Not Found",
      example: {
        status: 404,
        message: "Program Cycle Not Found",
        res: null,
      },
    },
    ALREADY_HAVE_A_APPLICATION: {
      status: 409,
      description: "User already has a application",
      example: {
        status: 409,
        message: "User Already have a application registered",
        res: null,
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while creating application",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  GET_USER_APPLICATIONS: {
    SUCCESS: {
      status: 200,
      description: "Fetched all applications for the user",
      example: {
        status: 200,
        message: "User Applications",
        res: {
          applications: [
            {
              id: "uuid",
              userId: "uuid",
              cycleId: "uuid",
              basicInfo: {
                title: "AI-powered Healthcare Assistant",
                summary:
                  "An AI system that helps doctors with faster diagnostics.",
                problem: "Healthcare diagnostics are slow and error-prone.",
                solution:
                  "Use AI algorithms to assist in diagnosis and reduce errors.",
                innovation:
                  "First system integrating AI and IoT for real-time diagnostics.",
              },
            },
          ],
        },
      },
    },
    NO_APPLICATIONS: {
      status: 200,
      description: "No applications found for this user",
      example: {
        status: 200,
        message: "No Applications Found",
        res: {
          applications: [],
        },
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while fetching applications",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  DELETE: {
    SUCCESS: {
      status: 200,
      description: "Application deleted successfully",
      example: {
        status: 200,
        message: "Application Deleted Successfully",
        res: {
          success: true,
          applicationId: "uuid",
        },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Application not found",
      example: {
        status: 404,
        message: "Application not found",
        res: null,
      },
    },
    IN_REVIEW: {
      status: 409,
      description: "Application is in review and cannot be deleted",
      example: {
        status: 409,
        message: "In review application cant be deleted",
        res: null,
      },
    },
    FORBIDDEN: {
      status: 403,
      description: "Only the applicant can delete the application",
      example: {
        status: 403,
        message: "Application can be only deleted by the applicant",
        res: null,
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while deleting application",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};
