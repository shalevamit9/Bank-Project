import { RequestHandler } from "express";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { UrlNotFoundException } from "../../exceptions/urlNotFound.exception.js";
import { ResponseMessage } from "../../types/messages.interface.js";
import { ICreateBusinessDto } from "./business.interface.js";
import businessService from "./business.service.js";

class BusinessController {
    getBusinessAccountById: RequestHandler = async (req, res) => {
        const business_account_id = req.params.id;
        const business_dto = await businessService.getBusinessAccountById(
            Number(business_account_id)
        );
        if (!business_dto) throw new UrlNotFoundException(req.originalUrl);

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { business_account: business_dto },
        };
        res.status(response.status).json(response);
    };

    createBusinessAccount: RequestHandler = async (req, res) => {
        const create_business_dto: ICreateBusinessDto = req.body;
        const business = await businessService.createBusinessAccount(
            create_business_dto
        );

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { business },
        };

        res.status(response.status).json(response);
    };

    transferToBusiness: RequestHandler = async (req, res) => {
        const { source_id, destination_id } = req.params;
        const { amount } = req.body;
        const transaction = await businessService.transferToBusiness(
            Number(source_id),
            Number(destination_id),
            Number(amount)
        );
        if (!transaction) throw new BadRequest("Passed Transfer Limit");

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { transaction },
        };

        res.status(response.status).json(response);
    };

    transferToIndividual: RequestHandler = async (req, res) => {
        const { source_id, destination_id } = req.params;
        const { amount } = req.body;
        const transaction = await businessService.transferToIndividual(
            Number(source_id),
            Number(destination_id),
            amount as number
        );

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { transaction },
        };

        res.status(response.status).json(response);
    };

    fxTransferToBusiness: RequestHandler = async (req, res) => {
        const { source_id, destination_id } = req.params;
        const { amount } = req.body;
        const transaction = await businessService.fxTransferToBusiness;
    };
}

const businessController = new BusinessController();

export default businessController;
