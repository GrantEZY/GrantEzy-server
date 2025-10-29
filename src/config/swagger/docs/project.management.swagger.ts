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
      description: "Only the Program Manager can create a project from this application",
      example: {
        status: 403,
        message: "Program Manager Only Can Access",
        res: null,
      },
    },
    APPLICATION_NOT_ELIGIBLE: {
      status: 403,
      description: "The application cannot be converted to a project (cycle is closed or not accepting)",
      example: {
        status: 403,
        message: "The Cycle Is Not Converting Application To Program Anymore",
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
  }
}
