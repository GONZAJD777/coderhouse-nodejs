export class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

export class BadRequestError extends CustomError {
    constructor(code, message) {
        super(code, message);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(code, message) {
        super(code, message);
    }
}

export class NotFoundError extends CustomError {
    constructor(code, message) {
        super(code, message);
    }
}