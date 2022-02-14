import { RequestHandler } from "express";
import { ResponseMessage } from "../../types/messages.interface.js";
import individualService from "./individual.service.js";
import { ICreateIndividualDto } from "./individual.interface.js";
import { TransactionException } from "../../exceptions/transaction.exception.js";


class IndividualController {
    getIndividualById: RequestHandler = async (req, res) => {
        const individual = await individualService.getIndividualById(
            Number(req.params.id)
        );
        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { individual_account: individual },
        };
        res.status(response.status).send(response);
    };
    
    createIndividualAccount: RequestHandler = async (req, res) => {
        const create_individual_dto: ICreateIndividualDto = req.body;
        const individual_dto = await individualService.createIndividualAccount(create_individual_dto);
        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { individual_account: individual_dto },
        };
        res.status(response.status).send(response);
    };

    transferToFamily: RequestHandler = async(req, res) => {
        const { amount } = req.body;

        const transfer_result = await individualService.transferToFamily(
            Number(req.params.source_id),
            Number(req.params.destination_id),
            Number(amount)
        );

        if (!transfer_result) {
            throw new TransactionException();
        }

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { transfer_result },
        };

        res.status(response.status).json(response);
    }

}

const individualController = new IndividualController();

export default individualController;
