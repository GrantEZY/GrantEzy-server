import {IncomingMessage, ServerResponse} from "http";
import {LoggerModule} from "nestjs-pino";
import {v4 as randomUUID} from "uuid";
import pino from "pino";

const genReqId = (request: IncomingMessage, response: ServerResponse) => {
    const existingID = request.id ?? request.headers["x-request-id"];

    if (existingID) return existingID;

    const id = randomUUID();
    response.setHeader("X-Request-Id", id);
    return id;
};

const LoggingSetup = LoggerModule.forRoot({
    pinoHttp: {
        name: process.env.LOGGING_PREFIX,
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
        transport:
            process.env.NODE_ENV !== "production"
                ? {
                      targets: [
                          {
                              target: "pino-pretty",
                              level: "debug",
                          },
                          {
                              target: "pino/file",
                              level: "debug",
                              options: {
                                  destination: process.env.LOG_FILE,
                                  mkdir: true,
                              },
                          },
                      ],
                  }
                : {
                      target: "pino/file",
                      options: {
                          destination: process.env.LOG_FILE,
                          mkdir: true,
                      },
                  },

        genReqId,

        serializers: {
            err: pino.stdSerializers.err,
            req: pino.stdSerializers.req,
            res: pino.stdSerializers.res,
        },

        wrapSerializers: true,

        customLogLevel(
            request: IncomingMessage,
            response: ServerResponse,
            error
        ) {
            if (response.statusCode >= 500 || error) return "error";
            if (response.statusCode >= 400) return "warn";
            if (response.statusCode >= 300) return "silent";
            return "info";
        },
        customAttributeKeys: {
            req: "request",
            res: "response",
            err: "error",
            responseTime: "timeTaken",
        },
        quietReqLogger: true,
        quietResLogger: true,
    },
});

export default LoggingSetup;
