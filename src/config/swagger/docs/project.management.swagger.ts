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


export const CYCLE_CRITERIA_RESPONSES = {
  CREATE_CRITERIA: {
    SUCCESS: {
      status: 201,
      description: "Criteria created successfully for a specific cycle",
      example: {
        status: 201,
        message: "Criteria Created Successfully",
        res: {
          criteriaName: "Design Review Criteria",
        },
      },
    },

    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The specified cycle was not found in the system",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },

    UNAUTHORIZED_MANAGER: {
      status: 403,
      description: "Only the Program Manager of the cycle can create criteria",
      example: {
        status: 403,
        message: "Only Program Manager Can Create The Criteria",
        res: null,
      },
    },

    INTERNAL_ERROR: {
      status: 500,
      description: "Unexpected server error occurred while creating criteria",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  GET_CYCLE_CRITERIA: {
    SUCCESS: {
      status: 200,
      description: "Successfully retrieved all evaluation criterias for the cycle",
      example: {
        status: 200,
        message: "Criterias For Cycle",
        res: {
          criterias: [
            {
              id: "uuid-of-criteria",
              name: "Code Quality Evaluation",
              reviewBrief: "Assess code modularity and maintainability",
              slug: "code-quality-evaluation",
              createdAt: "2025-11-05T12:00:00.000Z",
            },
          ],
        },
      },
    },

    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The specified cycle was not found in the system",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },

    UNAUTHORIZED_MANAGER: {
      status: 403,
      description:
        "Only the Program Manager of the cycle can access the criteria list",
      example: {
        status: 403,
        message: "Only Program Manager Can Get The Criterias",
        res: null,
      },
    },

    INTERNAL_ERROR: {
      status: 500,
      description:
        "Unexpected error occurred while fetching the cycle criterias",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};

export const APPLICANT_PROJECT_MANAGEMENT = {
  "GET_USER_CYCLE_CRITERIA": {
    "SUCCESS": {
      "status": 200,
      "description": "Successfully retrieved all evaluation criterias for the cycle for the user",
      "example": {
        "status": 200,
        "message": "Criterias For Cycle",
        "res": {
          "criterias": [
            {
              "id": "uuid-of-criteria",
              "name": "Code Quality Evaluation",
              "reviewBrief": "Assess code modularity and maintainability",
              "slug": "code-quality-evaluation",
              "createdAt": "2025-11-05T12:00:00.000Z"
            }
          ]
        }
      }
    },

    "CYCLE_NOT_FOUND": {
      "status": 404,
      "description": "The specified cycle was not found",
      "example": {
        "status": 404,
        "message": "Cycle Not Found",
        "res": null
      }
    },

    "USER_NOT_IN_CYCLE": {
      "status": 403,
      "description": "The user has no project/application under this cycle",
      "example": {
        "status": 403,
        "message": "User Doesn't have a project for this cycle",
        "res": null
      }
    },

    "INVALID_PROJECT_STATUS": {
      "status": 403,
      "description": "The user’s project for this cycle is not approved or archived",
      "example": {
        "status": 403,
        "message": "Project wasn't should be active or successfully archived",
        "res": null
      }
    },

    "INTERNAL_ERROR": {
      "status": 500,
      "description": "Unexpected server error occurred while fetching user cycle criteria",
      "example": {
        "status": 500,
        "message": "Internal Server Error",
        "res": null
      }
    }
  },"GET_USER_REVIEW_CRITERIA_DETAILS": {
    "SUCCESS": {
      "status": 200,
      "description": "Successfully retrieved the review criteria details and the user's submission for that project and cycle",
      "example": {
        "status": 200,
        "message": "Project Cycle Review Details",
        "res": {
          "criteria": {
            "id": "uuid-of-criteria",
            "name": "Design Review Criteria",
            "reviewBrief": "Evaluate completeness of design specification",
            "slug": "design-review",
            "createdAt": "2025-11-05T12:00:00.000Z"
          },
          "cycleSubmission": {
            "id": "uuid-of-assessment",
            "criteriaId": "uuid-of-criteria",
            "projectId": "uuid-of-project",
            "reviewBrief": "User's submitted review notes",
            "reviewDocument": {
              "title": "Design Review Document",
              "description": "Full submission document",
              "fileName": "design-review.pdf",
              "fileSize": 240392,
              "mimeType": "application/pdf",
              "storageUrl": "https://storage.server.com/design-review.pdf",
              "metaData": {}
            },
            "slug": "design-review-submission",
            "reviews": [
              {
                "id": "uuid-of-review",
                "comment": "Great submission",
                "rating": 4
              }
            ],
            "createdAt": "2025-11-10T12:00:00.000Z",
            "updatedAt": "2025-11-12T12:00:00.000Z"
          }
        }
      }
    },

    "CYCLE_NOT_FOUND": {
      "status": 404,
      "description": "The specified cycle was not found",
      "example": {
        "status": 404,
        "message": "Cycle Not Found",
        "res": null
      }
    },

    "USER_NOT_IN_CYCLE": {
      "status": 403,
      "description": "The user does not have a project inside this cycle",
      "example": {
        "status": 403,
        "message": "User Doesn't have a project for this cycle",
        "res": null
      }
    },

    "INVALID_PROJECT_STATUS": {
      "status": 403,
      "description": "The user's project is not approved or archived, thus cannot access review criteria",
      "example": {
        "status": 403,
        "message": "Project wasn't should be active or successfully archived",
        "res": null
      }
    },

    "CRITERIA_NOT_FOUND": {
      "status": 404,
      "description": "The review criteria with the given slug was not found",
      "example": {
        "status": 404,
        "message": "Review Criteria Not Found",
        "res": null
      }
    },

    "INTERNAL_ERROR": {
      "status": 500,
      "description": "Unexpected server error occurred while fetching the review criteria details",
      "example": {
        "status": 500,
        "message": "Internal Server Error",
        "res": null
      }
    }
  }
}

