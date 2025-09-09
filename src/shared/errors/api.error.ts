export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public name: string,
        public error?: string,
        public stack?: string
    ) {
        super(message);
        this.name = name || "ApiError";
        this.error = error ?? "Internal Server Error";
        this.status = status || 500;
        this.message = message || "An error occurred";
        this.stack = stack ?? new Error().stack;
    }
}

export default ApiError;
