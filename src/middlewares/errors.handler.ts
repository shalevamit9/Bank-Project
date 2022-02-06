import fs from "fs";
import { NextFunction, Request, RequestHandler, Response } from "express";
import log from "@ajar/marker";
import { ErrorMessage } from "../types/messages.interface.js";
import { HttpException } from "../exceptions/http.execption.js";
import { UrlNotFoundException } from "../exceptions/urlNotFound.exception.js";
import config from "../config/config.js";

const { NODE_ENV } = config;

type ErrorMiddleware = (
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => ReturnType<RequestHandler>;

export const urlNotFound: RequestHandler = (req, res, next) => {
    next(new UrlNotFoundException(req.originalUrl));
};

export const printError: ErrorMiddleware = (err, req, res, next) => {
    log.error(err);
    next(err);
};

export const errorLogger = (filepath: string): ErrorMiddleware => {
    const writeStream = fs.createWriteStream(filepath, {
        flags: "a",
        encoding: "utf-8",
    });

    return (err, req, res, next) => {
        const { requestId } = req;
        const { message, status, stack } = err;
        writeStream.write(
            `${requestId} - ${status} :: ${message} >> ${stack as string}\n`
        );

        next(err);
    };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorResponse: ErrorMiddleware = (err, req, res, next) => {
    const { message, status, stack } = err;
    const response: ErrorMessage = { message, status };

    if (NODE_ENV !== "production") {
        response.stack = stack;
    }

    res.status(response.status).json(response);
};
