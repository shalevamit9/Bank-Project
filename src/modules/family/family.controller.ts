/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import {
    // ErrorMessage,
    ResponseMessage,
} from "../../types/messages.interface.js";
import {
    ICreateFamily,
    IFamilyAccountDB,
    IUpdateMembers,
} from "./family.interface.js";
import familyService from "./family.service.js";

class FamilyController {
    createFamilyAccount: RequestHandler = async (req, res) => {
        // const family_data: ICreateFamily = req.body;

        // const family: IFamilyAccountDB =
        //     await familyService.createFamilyAccount(family_data);

        // const response: ResponseMessage = {
        //     status: 201,
        //     message: "success",
        //     data: { family },
        // };

        // res.status(response.status).json(response);
    };

    //  /api/family/:id?details=full
    getFamilyById: RequestHandler = async (req, res) => {
        // const details_level = String(req.query.details) || "full"; // move to service
        const family = await familyService.getFamilyById(
            Number(req.params.id),
            String(req.query.details)
        );

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { family },
        };

        res.status(response.status).json(response);
    };

    addFamilyMembers: RequestHandler = async (req, res) => {
        const details_level = String(req.query.details) || "full";
        const accounts_to_add: IUpdateMembers = req.body; // tuples [primaryID, amount]

        const family = await familyService.addFamilyMembers(
            Number(req.params.id),
            accounts_to_add.individual_accounts,
            details_level
        );

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { family },
        };
        res.status(response.status).json(response);
    };

    removeFamilyMembers: RequestHandler = async (req, res) => {
        const details_level = String(req.query.details) || "full";

        const accounts_to_remove: IUpdateMembers = req.body; // list of tuples [primaryID, amount to take from the family account]
        const family = await familyService.removeFamilyMembers(
            Number(req.params.id),
            accounts_to_remove.individual_accounts,
            details_level
        );

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { family },
        };
        res.status(response.status).json(response);
    };

    closeFamilyAccount: RequestHandler = async (req, res) => {
        const isClosed = await familyService.closeFamilyAccount(
            Number(req.params.id)
        );
        if (!isClosed) throw new BadRequest("Cannot close family account");

        const response: ResponseMessage = {
            status: 200,
            message: "success",
        };
        res.status(response.status).json(response);
    };

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
