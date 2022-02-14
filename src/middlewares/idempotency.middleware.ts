import { RequestHandler } from "express";
import _ from "lodash";
import { PreconditionException } from "../exceptions/precondition.exception.js";
import idempotencyService from "../modules/idempotency/idempotency.service.js";
import { ResponseMessage } from "../types/messages.interface.js";

export const idempotent: RequestHandler = async (req, res, next) => {
    const idempotency_key = req.headers["idempotency_key"] as string;
    const access_key = req.headers["access_key"] as string;
    if (!idempotency_key) return next();

    const idempotency = await idempotencyService.getIdempotency(
        access_key,
        idempotency_key
    );
    if (!idempotency) return next();
    const request_params = { ...req.body, ...req.params, ...req.query };
    const is_deep_equal = _.isEqual(
        request_params,
        JSON.parse(idempotency.request_params)
    );
    console.log({ idempotency });
    if (!is_deep_equal) throw new PreconditionException();
    const response: ResponseMessage = JSON.parse(idempotency.response);
    return res.status(response.status).json(response);
};
