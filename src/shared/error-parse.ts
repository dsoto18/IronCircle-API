import { Request, Response, NextFunction } from "express";
import { ResourceErrorReason } from "./error";

export function ErrorParser(
    error: any,
    req?: Request,
    res?: Response,
    next?: NextFunction
): void {
    const status = {
        code: 500,
        message: error.message,
    };
    switch (error.name) {
        case ResourceErrorReason.BAD_REQUEST:
            status.code = 400;
            console.warn(
                JSON.stringify({ status: status.code, ...error }),
            );
            break;
        case ResourceErrorReason.INVALID_ACCESS:
            status.code = 401;
            console.warn(
                JSON.stringify({ status: status.code, ...error }),
            );
            break;
        case ResourceErrorReason.FORBIDDEN:
            status.code = 403;
            console.warn(
                JSON.stringify({ status: status.code, ...error }),
            );
            break;
        case ResourceErrorReason.NOT_FOUND:
            status.code = 404;
            console.warn(
                JSON.stringify({ status: status.code, ...error }),
            );
            break;
        case ResourceErrorReason.CONFLICT:
            status.code = 409;
            console.warn(
                JSON.stringify({ status: status.code, ...error }),
            );
            break;
        case ResourceErrorReason.TOO_MANY_REQUEST:
            status.code = 429;
            console.warn(
                JSON.stringify({ status: status.code, ...error }),
            );
            break;
        case ResourceErrorReason.TOO_EARLY:
            status.code = 425;
            console.warn(
                JSON.stringify({ status: status.code, ...error }),
            );
            break;
        case ResourceErrorReason.INTERNAL_SERVER_ERROR:
            status.code = 500;
            status.message = "Internal service error";
            console.error(
                JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                    ...error,
                }),
            );
            break;
        default:
            status.code = 500;
            status.message = "Internal service error";
            console.error(
                JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                    ...error,
                }),
            );
            break;
    }

    if (error.redirect) {
        error.redirect(status.code, res);
    } else {
        res?.status(status.code).json(status);
    }
}