import { RequestHandler } from "express";
import { generateId } from "../utils/generate-id.js";

export const attachRequestId: RequestHandler = (req, res, next) => {
    req.requestId = generateId();
    next();
};
