import { RequestHandler } from "express";
import { HttpException } from "../exceptions/http.execption.js";

export default function (func: RequestHandler): RequestHandler {
    return async function (req, res, next) {
        try {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await func(req, res, next);
        } catch (err) {
            const error = err as HttpException;
            error.message = error.message || "something went wrong...";
            error.status = error.status || 500;

            next(error);
        }
    };
}
