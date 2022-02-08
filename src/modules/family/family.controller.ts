/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import {
    // ErrorMessage,
    ResponseMessage,
} from "../../types/messages.interface.js";
import { ICreateFamily, IFamilyAccountDB } from "./family.interface.js";
import familyService from "./family.service.js";

class FamilyController {
    createFamilyAccount: RequestHandler = async (req, res) => {
        /*  INPUT:
                The family account model including 
                    currency 
                    list of owning individual accounts - tuples [  primaryID, amount ]
        */
       
        // const family_data: ICreateFamily = { currency: req.body.currency, context: req.body.context || undefined };
        const family_data: ICreateFamily = req.body;
        // const owning_individual_accounts = req.body.individual_accounts as FamilyMemberContribution[];

        const family: IFamilyAccountDB = await familyService.createFamilyAccount(
            family_data
            // owning_individual_accounts
        );

        const response: ResponseMessage = {
            status: 201,
            message: "success",
            data: { family },
        };

        res.status(response.status).json(response);
    };

    //  /api/family/:id?details=full
    getFamilyDetails: RequestHandler = async (req, res) => {
        const details_level = String(req.query.details) || "full";
        const family = await familyService.getFamilyDetails(
            Number(req.params.id),
            details_level
        );

        console.log("controller: ", details_level);
        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { family },
        };

        res.status(response.status).json(response);
    };

    // addFamilyMembers: RequestHandler = async (req, res) => {
    //     // accepts as input: return short or full details

    //     const individual_account_ids = req.body; // tuples [primaryID, amount]
    //     const family = await familyService.addFamilyMembers(
    //         Number(req.params.id),
    //         individual_account_ids
    //     );

    //     if (family) {
    //         const response: ResponseMessage = {
    //             status: 200,
    //             message: "success",
    //             data: { family },
    //         };
    //         res.status(response.status).json(response);
    //     } else {
    //         const e_response: ErrorMessage = {
    //             status: 400,
    //             message: "failure",
    //         };
    //         res.status(e_response.status).json(e_response);
    //     }
    // };

    // removeFamilyMembers: RequestHandler = async (req, res) => {
    //     const individual_account_ids = req.body; // list of tuples [primaryID, amount to take from the family account]
    //     const family = await familyService.removeFamilyMembers(
    //         Number(req.params.id),
    //         individual_account_ids
    //     );

    //     if (family) {
    //         const response: ResponseMessage = {
    //             status: 200,
    //             message: "success",
    //             data: { family },
    //         };
    //         res.status(response.status).json(response);
    //     } else {
    //         const e_response: ErrorMessage = {
    //             status: 400,
    //             message: "failure",
    //         };
    //         res.status(e_response.status).json(e_response);
    //     }
    // };

    // closeAccount: RequestHandler = async (req, res) => {
    //     const family = await familyService.closeAccount(Number(req.params.id));

    //     if (family) {
    //         const response: ResponseMessage = {
    //             status: 200,
    //             message: "success",
    //         };
    //         res.status(response.status).json(response);
    //     } else {
    //         const e_response: ErrorMessage = {
    //             status: 400,
    //             message: "failure",
    //         };
    //         res.status(e_response.status).json(e_response);
    //     }
    // };

    // transferToBusiness: RequestHandler = async (req, res) => {
    //     const transfer_data = req.body;
    //     const result = await familyService.transferToBusiness(
    //         Number(req.params.sourceId),
    //         Number(req.params.destinationId),
    //         transfer_data
    //     );

    //     const response: ResponseMessage = {
    //         status: 200,
    //         message: "success",
    //         data: { result },
    //     };
    //     res.status(response.status).json(response);
    // };
}

const family_controller = new FamilyController();

export default family_controller;
