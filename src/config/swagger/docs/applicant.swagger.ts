export const APPLICATION_RESPONSES = {
  CREATE: {
    SUCCESS: {
      status: 201,
      description: "Application Registered Successfully",
      example: {
        status: 201,
        message: "Application Registered Successfully",
        res: {
          application: { id: "uuid", userId: "uuid", cycleId: "uuid" },
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "Program Cycle Not Found",
      example: { status: 404, message: "Program Cycle Not Found", res: null },
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
      example: { status: 500, message: "Internal Server Error", res: null },
    },
  },

  GET_USER_APPLICATIONS: {
    SUCCESS: {
      status: 200,
      description: "Fetched all applications for the user",
      example: {
        status: 200,
        message: "User Applications",
        res: { myApplications: [], linkedApplications: [] },
      },
    },
    NO_APPLICATIONS: {
      status: 200,
      description: "No applications found for this user",
      example: {
        status: 200,
        message: "No Applications Found",
        res: { myApplications: [], linkedApplications: [] },
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while fetching applications",
      example: { status: 500, message: "Internal Server Error", res: null },
    },
  },

  GET_APPLICATION_WITH_CYCLE: {
    SUCCESS: {
      status: 200,
      description: "Fetched application with cycle details",
      example: {
        status: 200,
        message: "Application Cycle Details",
        res: {
          cycle: { id: "uuid", name: "Cycle 1" },
          applicationDetails: { id: "uuid", title: "App Title" },
        },
      },
    },
    CYCLE_NOT_FOUND: {
      status: 404,
      description: "Cycle not found",
      example: { status: 404, message: "Cycle Not Found", res: null },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while fetching cycle/application details",
      example: { status: 500, message: "Internal Server Error", res: null },
    },
  },

  GET_USER_CREATED_APPLICATION: {
    SUCCESS: {
      status: 200,
      description: "Fetched user-created application",
      example: {
        status: 200,
        message: "User Application Fetch",
        res: { application: { id: "uuid", applicantId: "uuid" } },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Application not found",
      example: { status: 404, message: "Application Not Found", res: null },
    },
    FORBIDDEN: {
      status: 403,
      description: "Only the applicant can get further details",
      example: {
        status: 403,
        message: "Only the applicant can get further details",
        res: null,
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while fetching application",
      example: { status: 500, message: "Internal Server Error", res: null },
    },
  },

  DELETE: {
    SUCCESS: {
      status: 200,
      description: "Application deleted successfully",
      example: {
        status: 200,
        message: "Application Deleted Successfully",
        res: { success: true, applicationId: "uuid" },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Application not found",
      example: { status: 404, message: "Application not found", res: null },
    },
    IN_REVIEW: {
      status: 400,
      description: "Application is in review and cannot be deleted",
      example: {
        status: 400,
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
      example: { status: 500, message: "Internal Server Error", res: null },
    },
  },

  UPDATE_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Application details added successfully",
      example: {
        status: 200,
        message: "Application details added Successfully",
        res: { application: { id: "uuid", stepNumber: 2 } },
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Application not found",
      example: { status: 404, message: "Application Not Found", res: null },
    },
    FORBIDDEN: {
      status: 403,
      description: "Only the applicant can add further details",
      example: {
        status: 403,
        message: "Only the applicant can add further details",
        res: null,
      },
    },
    ORDER_NOT_FOLLOWED: {
      status: 400,
      description: "Step order not followed",
      example: {
        status: 400,
        message: "Application  Order not  Followed",
        res: null,
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected error while updating application details",
      example: { status: 500, message: "Internal Server Error", res: null },
    },
  },

  TEAMMATES: {
    SUCCESS: {
      status: 200,
      description: "Team members added successfully",
      example: {
        status: 200,
        message: "Application details added Successfully",
        res: { application: { id: "uuid", teamMateInvites: [] } },
      },
    },
    INVITE_ERROR: {
      status: 500,
      description: "Error in sending Invite to user",
      example: {
        status: 500,
        message: "Error in sending Invite to the user",
        res: null,
      },
    },
    NOT_FOUND: {
      status: 404,
      description: "Application not found",
      example: { status: 404, message: "Application  Not Found", res: null },
    },
    FORBIDDEN: {
      status: 403,
      description: "Only the applicant can add further details",
      example: {
        status: 403,
        message: "Only the applicant can add further details",
        res: null,
      },
    },
    ORDER_NOT_FOLLOWED: {
      status: 400,
      description: "Step order not followed",
      example: {
        status: 400,
        message: "Application  Order not  Followed",
        res: null,
      },
    },
  },
};
