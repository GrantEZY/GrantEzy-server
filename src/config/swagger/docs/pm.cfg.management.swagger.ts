export const PM_CONFIG_MNGMT = {
  MODIFY_CYCLE_STATUS: {
    SUCCESS: {
      status: 200,
      description: "Cycle status updated successfully",
      example: {
        status: 200,
        message: "Cycle status updated",
        res: {
          id: "uuid-of-cycle",
          status: "ACTIVE",
        },
      },
    },

    CYCLE_NOT_FOUND: {
      status: 404,
      description: "The cycle with the given ID was not found",
      example: {
        status: 404,
        message: "Cycle Not Found",
        res: null,
      },
    },

    UNAUTHORIZED_MANAGER: {
      status: 403,
      description: "Only the Program Manager can modify the cycle status",
      example: {
        status: 403,
        message: "Only Program Manager Can Modify the states",
        res: null,
      },
    },

    INVALID_STATUS: {
      status: 400,
      description: "Invalid or unsupported cycle status provided",
      example: {
        status: 400,
        message: "Invalid Cycle Status",
        res: null,
      },
    },
  },
};
