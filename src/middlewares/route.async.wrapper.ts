/* eslint-disable @typescript-eslint/await-thenable */
import { RequestHandler } from "express";

export default function (func: RequestHandler): RequestHandler {
    return async function (req, res, next) {
        try {
            await func(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
