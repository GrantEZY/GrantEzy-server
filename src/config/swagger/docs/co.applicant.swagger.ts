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


export const CO_APPLICANT_PROJECT_RESPONSES = {
  GET_USER_LINKED_PROJECTS: {
    SUCCESS: {
      status: 200,
      description: "Fetched all projects linked to the user as a teammate",
      example: {
        status: 200,
        message: "User Linked Projects",
        res: {
          applications: [
            {
              id: "uuid",
              title: "Linked Project Title",
              applicantId: "uuid",
              teammates: [
                { personId: "uuid", name: "John Doe", role: "CO_APPLICANT" },
              ],
              cycleId: "uuid",
              createdAt: "2025-11-01T10:00:00Z",
            },
          ],
        },
      },
    },

    NO_LINKED_PROJECTS: {
      status: 200,
      description: "No linked projects found for this user",
      example: {
        status: 200,
        message: "No Linked Projects Found",
        res: { applications: [] },
      },
    },

    ERROR: {
      status: 500,
      description: "Unexpected error while fetching linked projects",
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
      description: "Fetched project details for linked user",
      example: {
        status: 200,
        message: "Project Details",
        res: {
          project: {
            id: "uuid",
            title: "Linked Project Example",
            description: "This project was linked to the current user",
            applicationId: "uuid",
            applicantId: "uuid",
            teammates: [
              { personId: "uuid", name: "Alice Smith", role: "Co-Applicant" },
              { personId: "uuid", name: "Bob Kumar", role: "Research Partner" },
            ],
            createdAt: "2025-10-30T09:00:00Z",
            updatedAt: "2025-11-02T14:10:00Z",
          },
        },
      },
    },

    APPLICATION_NOT_FOUND: {
      status: 404,
      description: "Application not found for given slug",
      example: {
        status: 404,
        message: "Application Not Found",
        res: null,
      },
    },

    FORBIDDEN: {
      status: 403,
      description: "User is not linked with this application",
      example: {
        status: 403,
        message: "User Not Linked With the Application",
        res: null,
      },
    },

    NOT_A_PROJECT: {
      status: 404,
      description: "Application exists but has not yet been converted to a project",
      example: {
        status: 404,
        message: "Application Is Not A Project",
        res: null,
      },
    },

    ERROR: {
      status: 500,
      description: "Unexpected error while fetching project details",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};

