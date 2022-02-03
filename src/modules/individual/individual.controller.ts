/* eslint-disable class-methods-use-this */
import { Request, Response, RequestHandler } from "express";
import { ResponseMessage } from "../../types/messages.interface";
import individualService from "./individual.service";
import raw from "../../middleware/route.async.wrapper";



class IndividualController {
    createIndividual : RequestHandler = raw(
            async (req : Request, res : Response) => {
            const individual = await individualService.createIndividual(req.body);
            const response : ResponseMessage = {
                status: 201,
                message: "success",
                data: { individual },
            };
            res.status(response.status).send(response);
        }
    );

    getIndividual : RequestHandler = raw(
        async (req : Request, res : Response) => {
        const individual = await individualService.getIndividual(Number(req.params.id));
        const response : ResponseMessage = {
            status: 200,
            message: "success",
            data: { individual },
        };
        res.status(response.status).send(response);
    });
}

const individualController = new IndividualController();

export default individualController;

