/* eslint-disable */
type ClassType<T = any> = new (...args: any[]) => T;

export function ApiResponse<T>(TClass: ClassType<T>) {
    abstract class ApiResponseClass {
        status: number;

        message: string;

        res?: T;
    }

    return ApiResponseClass;
}

export class EmptyResponse {
    id: string;
}
