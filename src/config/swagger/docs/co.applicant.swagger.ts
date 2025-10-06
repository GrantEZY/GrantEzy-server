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
      description: "Invite is not in a valid state (e.g., already accepted or revoked)",
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
};
