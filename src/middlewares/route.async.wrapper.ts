import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<RequestHandler>;

export default function (func: AsyncRequestHandler): RequestHandler {
    return async function (req, res, next) {
        try {
            await func(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
