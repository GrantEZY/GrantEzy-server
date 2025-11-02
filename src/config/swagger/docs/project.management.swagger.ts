export const PROJECT_MANAGEMENT_RESPONSES = {
  CREATE: {
    SUCCESS: {
      status: 201,
      description: "Project created successfully from an approved application",
      example: {
        status: 201,
        message: "Project Created",
        res: {
          applicationId: "uuid-of-application",
          projectId: "uuid-of-project",
        },
      },
    },
    APPLICATION_NOT_FOUND: {
      status: 404,
      description: "The application with the given ID was not found",
      example: {
        status: 404,
        message: "Application Not Found",
        res: null,
      },
    },
    UNAUTHORIZED_MANAGER: {
      status: 403,
      description:
        "Only the Program Manager can create a project from this application",
      example: {
        status: 403,
        message: "Program Manager Only Can Access",
        res: null,
      },
    },
    APPLICATION_NOT_ELIGIBLE: {
      status: 403,
      description:
        "The application cannot be converted to a project (cycle is closed or not accepting)",
      example: {
        status: 403,
        message:
          "The Cycle Is Not Converting Application To Program Anymore",
        res: null,
      },
    },
    INTERNAL_ERROR: {
      status: 500,
      description: "Unexpected error occurred while creating the project",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  GET_CYCLE_PROJECTS: {
    SUCCESS: {
      status: 200,
      description: "Successfully retrieved all projects under the given cycle",
      example: {
        status: 200,
        message: "Cycle Projects",
        res: {
          applications: [
            {
              id: "uuid-of-application",
              title: "AI Research Grant",
              status: "APPROVED",
              createdAt: "2025-10-20T12:00:00.000Z",
            },
          ],
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The specified cycle was not found",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },
    UNAUTHORIZED_MANAGER: {
      status: 403,
      description:
        "Only the program manager of the cycle can access the project list",
      example: {
        status: 403,
        message: "Only Program Manager Can Access The Route",
        res: null,
      },
    },
    INTERNAL_ERROR: {
      status: 500,
      description: "Unexpected error occurred while fetching cycle projects",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  GET_PROJECT_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Successfully retrieved detailed project information",
      example: {
        status: 200,
        message: "Project Details",
        res: {
          project: {
            id: "uuid-of-project",
            title: "AI Research Grant",
            description: "Exploring neural networks in social systems",
            createdAt: "2025-10-20T12:00:00.000Z",
            team: [
              { id: "uuid-user1", name: "Alice" },
              { id: "uuid-user2", name: "Bob" },
            ],
          },
        },
      },
    },
    APPLICATION_NOT_FOUND: {
      status: 404,
      description:
        "The application with the given slug or cycle was not found or mismatched",
      example: {
        status: 404,
        message: "Application Not Found",
        res: null,
      },
    },
    NOT_A_PROJECT: {
      status: 403,
      description: "The given application has not yet been converted to a project",
      example: {
        status: 403,
        message: "Application Is Not a Project",
        res: null,
      },
    },
    PROJECT_NOT_FOUND: {
      status: 404,
      description: "No project found for the given application ID",
      example: {
        status: 404,
        message: "Project Not Found",
        res: null,
      },
    },
    UNAUTHORIZED_MANAGER: {
      status: 403,
      description:
        "Only the program manager associated with this cycle can view project details",
      example: {
        status: 403,
        message: "Only Program Manager Can Access The Route",
        res: null,
      },
    },
    INTERNAL_ERROR: {
      status: 500,
      description: "Unexpected error occurred while fetching project details",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};
