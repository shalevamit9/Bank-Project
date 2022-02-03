/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response, NextFunction } from "express";



type f = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export default function raw(func: f) {
    return async function (req: Request, res: Response, next: NextFunction) {
        func(req, res, next).catch((err) => next(err));
    };
}