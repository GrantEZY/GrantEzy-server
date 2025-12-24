import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import {Response} from "express";
import ApiError from "./api.error";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";
        let errorType = "ServerError";
        if (exception instanceof ApiError) {
            status = exception.status > 500 ? 500 : exception.status;
            message =
                exception.status > 500
                    ? "Internal Server Error"
                    : exception.message;
            errorType = exception.status > 500 ? "ServerError" : exception.name;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();

            if (status === HttpStatus.UNAUTHORIZED) {
                message = "UnAuthorized";
                errorType = "Authentication Error";
            }

            if (status === HttpStatus.NOT_ACCEPTABLE) {
                message = "Data Provided is Not Valid";
                errorType = "Validation Error";
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            errorType = exception.constructor.name;
        }

        response.status(status).json({
            status: status,
            errorType,
            message,
            res: null,
        });
    }
}
