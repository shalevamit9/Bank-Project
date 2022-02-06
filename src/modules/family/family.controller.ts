/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import { ErrorMessage, ResponseMessage } from "../../types/messages.interface.js";
import { ICreateFamily, IFamilyAccount } from "./family.interface.js";
import familyService from "./family.service.js";

class FamilyController {
    createFamilyAccount: RequestHandler = async (req, res) => {
        const family_data: ICreateFamily = req.body;
        const family: IFamilyAccount = await familyService.createFamilyAccount(family_data);

        const response_data = {
            primaryId: family.id,
            currency: family.currency,
            balance: family.balance
        };

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { responseData: response_data },
        };

        res.status(response.status).json(response);
    };

    // return the family model and owner id's
    getShortFamilyDetails: RequestHandler = async (req, res) => {
        const family_details = await familyService.getShortFamilyDetails(Number(req.params.id));

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { familyDetails: family_details },
        };

        res.status(response.status).json(response);
    };

    // return the family model and full owners data
    getFullFamilyDetails: RequestHandler = async (req, res) => {
        const family_details = await familyService.getFullFamilyDetails(Number(req.params.id));

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { familyDetails: family_details },
        };

        res.status(response.status).json(response);
    };

    addFamilyMembers: RequestHandler = async (req, res) => {
        const individual_account_ids = req.body;
        const family = await familyService.addFamilyMembers(Number(req.params.id), individual_account_ids);

        
        if(family) {
            const response: ResponseMessage = {
                status: 200,
                message: "success",
                data: { family },
            };
            res.status(response.status).json(response);
        } else {
            const e_response: ErrorMessage = {
                status: 400,
                message: "failure",
            };
            res.status(e_response.status).json(e_response);
        }
    };

    removeFamilyMembers: RequestHandler = async (req, res) => {
        const individual_account_ids = req.body;
        const family = await familyService.removeFamilyMembers(Number(req.params.id), individual_account_ids);

        if (family) {
            const response: ResponseMessage = {
                status: 200,
                message: "success",
                data: { family },
            };
            res.status(response.status).json(response);
        } else {
            const e_response: ErrorMessage = {
                status: 400,
                message: "failure",
            };
            res.status(e_response.status).json(e_response);
        }
    };

    closeAccount: RequestHandler = async (req, res) => {
        const family = await familyService.closeAccount(Number(req.params.id));

        if (family) {
            const response: ResponseMessage = {
                status: 200,
                message: "success",
            };
            res.status(response.status).json(response);
        } else {
            const e_response: ErrorMessage = {
                status: 400,
                message: "failure",
            };
            res.status(e_response.status).json(e_response);
        }
    };

    transferToBusiness: RequestHandler = async (req, res) => {
        const transfer_data = req.body;
        const result = await familyService.transferToBusiness(Number(req.params.sourceId), Number(req.params.destinationId), transfer_data);

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { result }
        };
        res.status(response.status).json(response);
        
    };
}


const family_controller = new FamilyController();

export default family_controller;