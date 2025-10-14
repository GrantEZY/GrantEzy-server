export const CO_APPLICANT_RESPONSES = {
  GET_APPLICATION_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Fetched application details for co-applicant",
      example: {
        status: 200,
        message: "Application Details for CoApplicant",
        res: {
          application: {
            id: "uuid",
            title: "Grant Application",
            applicantId: "uuid",
            teammates: [
              { personId: "uuid", name: "John Doe", role: "Co-Applicant" },
            ],
            teamMateInvites: [
              { email: "invitee@example.com", inviteAs: "CO_APPLICANT" },
            ],
          },
        },
      },
    },

    NOT_FOUND: {
      status: 404,
      description: "Application not found",
      example: {
        status: 404,
        message: "Application Not Found",
        res: null,
      },
    },

    FORBIDDEN: {
      status: 403,
      description: "User is not allowed to view this application",
      example: {
        status: 403,
        message: "Only TeamMates Can View the Application",
        res: null,
      },
    },

    ERROR: {
      status: 500,
      description: "Unexpected error while fetching application details",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  GET_TOKEN_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Fetched co-applicant invite details using token",
      example: {
        status: 200,
        message: "Co Applicant Invite Details Fetch",
        res: {
          invitedAt: "2025-10-06T10:00:00.000Z",
          application: {
            name: "Grant for Community Development",
            problem: "Lack of infrastructure in rural areas",
          },
        },
      },
    },

    TOKEN_INVALID: {
      status: 404,
      description: "Token is invalid or not found",
      example: {
        status: 404,
        message: "Token Not Valid",
        res: null,
      },
    },

    INVITE_CONFLICT: {
      status: 403,
      description:
        "Invite is not in a valid state (e.g., already accepted or revoked)",
      example: {
        status: 403,
        message: "Invite Not Valid",
        res: null,
      },
    },

    INVITE_EXPIRED: {
      status: 400,
      description: "Invite token has expired",
      example: {
        status: 400,
        message: "Invite got expired",
        res: null,
      },
    },

    APPLICATION_NOT_FOUND: {
      status: 404,
      description: "Associated application not found",
      example: {
        status: 404,
        message: "Application Not Found",
        res: null,
      },
    },

    ERROR: {
      status: 500,
      description: "Unexpected error while fetching invite details",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  UPDATE_INVITE_STATUS: {
    SUCCESS_ACCEPTED: {
      status: 200,
      description:
        "Invite accepted successfully and user added as teammate to the application",
      example: {
        status: 200,
        message: "User TeamMate Status Updated",
        res: {
          applicationId: "uuid",
          status: "ACCEPTED",
        },
      },
    },

    SUCCESS_REJECTED: {
      status: 200,
      description: "Invite rejected successfully",
      example: {
        status: 200,
        message: "User TeamMate Status Updated",
        res: {
          applicationId: "uuid",
          status: "REJECTED",
        },
      },
    },

    UPDATE_FAILED: {
      status: 400,
      description: "Error occurred while updating user invite status",
      example: {
        status: 400,
        message: "Error in Updating the User Invite Status",
        res: null,
      },
    },

    USER_NOT_FOUND: {
      status: 404,
      description: "User not found while accepting invite",
      example: {
        status: 404,
        message: "User Not Found",
        res: null,
      },
    },

    APPLICATION_UPDATE_FAILED: {
      status: 502,
      description: "Failed to add user as teammate due to DB error",
      example: {
        status: 502,
        message: "Database Error while updating application teammates",
        res: null,
      },
    },

    ERROR: {
      status: 500,
      description:
        "Unexpected error while updating teammate invite status",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};
