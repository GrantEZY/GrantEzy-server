export const PUBLIC_RESPONSES = {
  GET_ACTIVE_PROGRAMS: {
    SUCCESS: {
      status: 200,
      description: "Active programs fetched successfully",
      example: {
        status: 200,
        message: "Active Programs Fetched Successfully",
        res: {
          programs: [
            {
              id: "uuid-of-program",
              name: "Program Name",
              slug: "program-name",
              status: "ACTIVE",
              organizationId: "uuid-of-organization",
            },
          ],
        },
      },
    },
    ERROR: {
      status: 500,
      description: "Internal server error while fetching active programs",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },

  GET_PROGRAM_CYCLE_DETAILS: {
    SUCCESS: {
      status: 200,
      description: "Program and its active cycle fetched successfully",
      example: {
        status: 200,
        message: "Program Cycle Details Fetched Successfully",
        res: {
          program: {
            id: "uuid-of-program",
            name: "Program Name",
            slug: "program-name",
            status: "ACTIVE",
            organizationId: "uuid-of-organization",
          },
          cycle: {
            id: "uuid-of-cycle",
            name: "Cycle Name",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "ACTIVE",
          },
        },
      },
    },

    PROGRAM_NOT_FOUND: {
      status: 404,
      description: "Program not found for the given slug",
      example: {
        status: 404,
        message: "Program Not Found",
        res: null,
      },
    },

    PROGRAM_INACTIVE: {
      status: 409,
      description: "Program exists but is not currently active",
      example: {
        status: 409,
        message: "Program is not Active Currently",
        res: null,
      },
    },

    NO_ACTIVE_CYCLE_FOUND: {
      status: 404,
      description: "No active cycle found for the given program",
      example: {
        status: 404,
        message: "No Active Cycle Found for this Program",
        res: null,
      },
    },

    ERROR: {
      status: 500,
      description: "Internal server error while fetching program cycle details",
      example: {
        status: 500,
        message: "Internal Server Error",
        res: null,
      },
    },
  },
};
