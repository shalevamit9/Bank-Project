import { RequestHandler } from "express";

export default function (func: RequestHandler): RequestHandler {
    return async function (req, res, next) {
        try {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await func(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
