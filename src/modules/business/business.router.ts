import express from "express";
import businessController from "./business.controller.js";

class BusinessRouter {
    readonly router = express.Router();

    constructor() {
        this.router.get(
            "/business/:id",
            businessController.getBusinessAccountById
        );

        this.router.post("/", businessController.createBusinessAccount);
        this.router.post(
            "/business/transfer/:source_id/business/:destination_id",
            businessController.transferBusinessToBusiness
        );
        this.router.post(
            "/business/transfer/:source_id/individual/:destination_id",
            businessController.transferBusinessToIndividual
        );
        this.router.post(
            "/business/FXtransfer/:source_id/business/:destination_id",
            businessController.fxTransferBusinessToBusiness
        );
    }
}

const businessRouter = new BusinessRouter();

export default businessRouter;
