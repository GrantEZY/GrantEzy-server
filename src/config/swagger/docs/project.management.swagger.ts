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

export const PROJECT_ASSESSMENT_REVIEWER_RESPONSES = {
  ASSIGN: {
    SUCCESS: {
      status: 200,
      description: "Reviewer assigned successfully for project assessment",
      example: {
        status: 200,
        message: "Reviewer Assigned Successfully",
        res: {
          email: "reviewer@example.com",
          application: "AI Research Project",
        },
      },
    },

    ASSESSMENT_NOT_FOUND: {
      status: 404,
      description: "The project assessment with the given ID was not found",
      example: {
        status: 404,
        message: "Assessment Not Found",
        res: null,
      },
    },

    UNAUTHORIZED_MANAGER: {
      status: 403,
      description: "Only the program manager of the project can assign reviewers",
      example: {
        status: 403,
        message: "Only Program Manager Can Assign Reviewer",
        res: null,
      },
    },

    INVITE_FAILED: {
      status: 500,
      description: "Failed to send the reviewer invitation email",
      example: {
        status: 500,
        message: "Failed to send invite email",
        res: null,
      },
    },

    INTERNAL_ERROR: {
      status: 500,
      description:
        "Unexpected error occurred while assigning a reviewer for project assessment",
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
        "message": "Project should be active or archived",
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
        "message": "Project should be active or archived",
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
  }, "CREATE_PROJECT_ASSESSMENT": {
    "SUCCESS_CREATED": {
      "status": 201,
      "description": "Successfully created a new project assessment submission for the given criteria and project",
      "example": {
        "status": 201,
        "message": "Project Assessment Created",
        "res": {
          "submission": {
            "id": "c3af7a39-3e22-4df7-91d9-fd3e21990011",
            "criteriaId": "5e6c9c20-2ad1-4d5a-8ea3-3dd93f2f9011",
            "projectId": "a92d5f8f-6c82-4f40-8f7f-a8be2cc4c222",
            "reviewBrief": "This project demonstrates great architecture and scalability improvements.",
            "reviewDocument": {
              "title": "Architecture Review",
              "description": "Submitted architectural review document",
              "fileName": "architecture-review.pdf",
              "fileSize": 203301,
              "mimeType": "application/pdf",
              "storageUrl": "https://storage.server.com/files/architecture-review.pdf",
              "metaData": {
                "version": "1.0",
                "pageCount": 8
              }
            },
            "slug": "architecture-review-assessment",
            "createdAt": "2025-11-10T12:00:00.000Z",
            "updatedAt": "2025-11-10T12:00:00.000Z"
          }
        }
      }
    },

    "SUCCESS_UPDATED": {
      "status": 200,
      "description": "Successfully updated an already submitted assessment for the project",
      "example": {
        "status": 200,
        "message": "Project Assessment Updated",
        "res": {
          "submission": {
            "id": "c3af7a39-3e22-4df7-91d9-fd3e21990011",
            "criteriaId": "5e6c9c20-2ad1-4d5a-8ea3-3dd93f2f9011",
            "projectId": "a92d5f8f-6c82-4f40-8f7f-a8be2cc4c222",
            "reviewBrief": "Updated review: improved modularity and better documentation.",
            "reviewDocument": {
              "title": "Updated Architecture Review",
              "description": "Updated submission document",
              "fileName": "architecture-review-v2.pdf",
              "fileSize": 223102,
              "mimeType": "application/pdf",
              "storageUrl": "https://storage.server.com/files/architecture-review-v2.pdf",
              "metaData": {
                "version": "2.0",
                "pageCount": 9
              }
            },
            "slug": "architecture-review-assessment",
            "createdAt": "2025-11-10T12:00:00.000Z",
            "updatedAt": "2025-11-11T09:15:00.000Z"
          }
        }
      }
    },

    "CRITERIA_NOT_FOUND": {
      "status": 404,
      "description": "The given criteria ID does not exist under the specified cycle",
      "example": {
        "status": 404,
        "message": "Criteria Not Found",
        "res": null
      }
    },

    "APPLICATION_NOT_PROJECT": {
      "status": 403,
      "description": "The user has an application but not a valid project under the cycle for submission",
      "example": {
        "status": 403,
        "message": "Application Is Not a Project",
        "res": null
      }
    },

    "INTERNAL_ERROR": {
      "status": 500,
      "description": "Unexpected error occurred while creating/updating an assessment",
      "example": {
        "status": 500,
        "message": "Internal Server Error",
        "res": null
      }
    }
  },"GET_CYCLE_CRITERIA_ASSESSMENTS": {
    "SUCCESS": {
      "status": 200,
      "description": "Successfully retrieved all assessment submissions for the given criteria within the cycle",
      "example": {
        "status": 200,
        "message": "Criteria Submissions For Assessment",
        "res": {
          "submissions": [
            {
              "id": "uuid-of-submission",
              "projectId": "uuid-of-project",
              "criteriaId": "uuid-of-criteria",
              "reviewBrief": "The work demonstrates strong modularity and maintainability.",
              "reviewDocument": {
                "title": "Review Attachment",
                "description": "Detailed evaluation document",
                "fileName": "project-review.pdf",
                "fileSize": 182304,
                "mimeType": "application/pdf",
                "storageUrl": "https://storage.example.com/reviews/project-review.pdf",
                "metaData": {
                  "submittedAt": "2025-11-08T10:22:00.000Z"
                }
              },
              "slug": "assessment-slug-example",
              "createdAt": "2025-11-08T10:22:00.000Z",
              "updatedAt": "2025-11-08T10:22:00.000Z"
            }
          ],
          "criteria": {
            "id": "uuid-of-criteria",
            "name": "Code Quality Evaluation",
            "reviewBrief": "Assess code modularity and maintainability",
            "slug": "code-quality-evaluation",
            "createdAt": "2025-11-05T12:00:00.000Z",
            "cycle": {
              "id": "uuid-of-cycle",
              "slug": "cycle-q4-2025"
            }
          }
        }
      }
    },

    "CRITERIA_NOT_FOUND": {
      "status": 404,
      "description": "The specified criteria was not found or does not belong to the given cycle",
      "example": {
        "status": 404,
        "message": "Criteria Not Found",
        "res": null
      }
    },

    "UNAUTHORIZED_MANAGER": {
      "status": 403,
      "description": "Only the Program Manager of the cycle may view submissions for this criteria",
      "example": {
        "status": 403,
        "message": "Only Program Manager Can Access the Criteria Submissions",
        "res": null
      }
    },

    "INTERNAL_ERROR": {
      "status": 500,
      "description": "Unexpected server error occurred while fetching assessment submissions",
      "example": {
        "status": 500,
        "message": "Internal Server Error",
        "res": null
      }
    }
  }
}

