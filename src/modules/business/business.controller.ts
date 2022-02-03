/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import { ResponseMessage } from "../../types/messages.interface.js";
import { ICreateBusinessDto } from "./business.interface.js";
import businessService from "./business.service.js";

class BusinessController {
    getBusinessAccountById: RequestHandler = (req, res) => {
        throw new Error("Method not implemented.");
    };

    createBusinessAccount: RequestHandler = async (req, res) => {
        const businessDto: ICreateBusinessDto = req.body;
        const business = await businessService.createBusinessAccount(
            businessDto
        );

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { business },
        };

        res.status(response.status).json(response);
    };

    transferBusinessToBusiness: RequestHandler = async (req, res) => {
        const { source_id, destination_id } = req.params;
        const { amount } = req.body;
        const transaction = await businessService.transferBusinessToBusiness(
            source_id,
            destination_id,
            amount as number
        );

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { transaction },
        };

        res.status(response.status).json(response);
    };
    transferBusinessToIndividual: RequestHandler = async (req, res) => {
        const { sourceId, destinationId } = req.params;
        const { amount } = req.body;
        const transaction = await businessService.transferBusinessToIndividual(
            sourceId,
            destinationId,
            amount as number
        );

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { transaction },
        };

        res.status(response.status).json(response);
    };

    fxTransferBusinessToBusiness: RequestHandler = async (req, res) => {
        throw new Error("Method not implemented.");
    };
}

const businessController = new BusinessController();

export default businessController;
