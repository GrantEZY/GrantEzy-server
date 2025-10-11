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

   SUBMIT_REVIEW: {
    SUCCESS: {
      status: 200,
      description: "Review submitted successfully by the reviewer",
      example: {
        status: 200,
        message: "Review Submitted Successfully",
        res: {
          reviewId: "uuid-of-review",
          applicationId: "uuid-of-application",
          status: "COMPLETED",
        },
      },
    },

    REVIEW_NOT_FOUND: {
      status: 404,
      description:
        "The review record for this user and application was not found",
      example: {
        status: 404,
        message: "Review Not Found",
        res: null,
      },
    },

    REVIEW_ALREADY_COMPLETED: {
      status: 400,
      description:
        "The review was already marked as completed; cannot resubmit",
      example: {
        status: 400,
        message: "Review Already Completed",
        res: null,
      },
    },

    INTERNAL_ERROR: {
      status: 500,
      description:
        "Unexpected error while submitting the review for the application",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
    GET_USER_REVIEWS: {
    SUCCESS: {
      status: 200,
      description: "Fetched all reviews assigned to the logged-in reviewer",
      example: {
        status: 200,
        message: "User Reviews Fetch",
        res: {
          reviews: [
            {
              id: "uuid-of-review",
              slug: "review-slug",
              application: {
                id: "uuid-of-application",
                title: "Application Title",
                cycle: {
                  id: "uuid-of-cycle",
                  slug: "cycle-slug",
                },
              },
              status: "IN_PROGRESS",
              createdAt: "2025-10-10T12:00:00.000Z",
            },
          ],
        },
      },
    },
    NO_REVIEWS_FOUND: {
      status: 404,
      description: "No reviews found for this reviewer",
      example: {
        status: 404,
        message: "No Reviews Found",
        res: [],
      },
    },
    INTERNAL_ERROR: {
      status: 500,
      description:
        "Unexpected error occurred while fetching reviews for the reviewer",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  GET_REVIEW_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Fetched review details for the logged-in reviewer",
      example: {
        status: 200,
        message: "Review Details Fetched Successfully",
        res: {
          review: {
            id: "uuid-of-review",
            slug: "review-slug",
            reviewerId: "uuid-of-reviewer",
            recommendation: "APPROVE",
            scores: {
              impact: 8,
              feasibility: 7,
              innovation: 9,
            },
            comments: "Excellent proposal execution",
          },
          application: {
            id: "uuid-of-application",
            title: "Grant for Community Development",
            problem: "Lack of infrastructure in rural areas",
            cycleSlug: "cycle-2025",
          },
        },
      },
    },
    REVIEW_NOT_FOUND: {
      status: 404,
      description: "Review with the given slug not found for this reviewer",
      example: {
        status: 404,
        message: "Review Not Found",
        res: null,
      },
    },
    UNAUTHORIZED_USER: {
      status: 403,
      description: "The logged-in user is not the assigned reviewer",
      example: {
        status: 403,
        message: "User is not reviewer",
        res: null,
      },
    },
    INTERNAL_ERROR: {
      status: 500,
      description:
        "Unexpected error occurred while fetching the review details",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};
