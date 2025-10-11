export const REVIEWER_RESPONSES = {
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

  UPDATE_REVIEW_INVITE: {
    SUCCESS_ACCEPTED: {
      status: 201,
      description:
        "Reviewer accepted the invite and was successfully added to the application review team",
      example: {
        status: 201,
        message: "User Reviewer Status Updated",
        res: {
          applicationId: "uuid-of-application",
          status: "ACCEPTED",
          reviewId: "uuid-of-review",
        },
      },
    },
    SUCCESS_REJECTED: {
      status: 200,
      description:
        "Reviewer rejected the invite. Application review not created.",
      example: {
        status: 200,
        message: "User Reviewer Status Updated",
        res: {
          applicationId: "uuid-of-application",
          status: "REJECTED",
          reviewId: null,
        },
      },
    },
    ALREADY_REVIEWER: {
      status: 200,
      description:
        "User is already assigned as a reviewer for this application; no new review created.",
      example: {
        status: 200,
        message: "User is already a Reviewer for this Application",
        res: {
          applicationId: "uuid-of-application",
          status: "ACCEPTED",
          reviewId: "uuid-of-existing-review",
        },
      },
    },
    USER_NOT_FOUND: {
      status: 404,
      description: "No user found with the associated email for the invite.",
      example: {
        status: 404,
        message: "User Not Found",
        res: null,
      },
    },
    CONFLICT_ERROR: {
      status: 400,
      description:
        "Invite status could not be updated or review creation failed.",
      example: {
        status: 400,
        message: "Error in Updating the User Invite Status",
        res: null,
      },
    },
    ERROR: {
      status: 500,
      description: "Unexpected server error while updating review invite status",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};
