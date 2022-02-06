import express from "express";
import businessController from "./business.controller.js";

class BusinessRouter {
    readonly router = express.Router();

    constructor() {
        this.router.get("/:id", businessController.getBusinessAccountById);

        this.router.post("/", businessController.createBusinessAccount);
        this.router.post(
            "/transfer/:source_id/business/:destination_id",
            businessController.transferBusinessToBusiness
        );
        this.router.post(
            "/transfer/:source_id/individual/:destination_id",
            businessController.transferBusinessToIndividual
        );
        this.router.post(
            "/FXtransfer/:source_id/business/:destination_id",
            businessController.fxTransferBusinessToBusiness
        );
    }
}

const businessRouter = new BusinessRouter();

export default businessRouter;
