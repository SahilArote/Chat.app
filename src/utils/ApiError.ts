class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default ApiError;
