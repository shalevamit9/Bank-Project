/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
import { RequestHandler } from "express";


export default function raw(func: RequestHandler) : RequestHandler {
    return async function (req, res, next) {
        try{
            await func(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}