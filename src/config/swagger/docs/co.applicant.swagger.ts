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
};
