import express from "express";
import businessController from "./business.controller.js";

class BusinessRouter {
    readonly router = express.Router();

    constructor() {
        this.router.post("/", businessController.createBusinessAccount);
        this.router.post(
            "/business/transfer/:sourceId/business/:destinationId",
            businessController.transferBusinessToBusiness
        );
        this.router.post(
            "/business/transfer/:sourceId/individual/:destinationId",
            businessController.transferBusinessToIndividual
        );
        this.router.post(
            "/business/FXtransfer/:sourceId/business/:destinationId",
            businessController.fxTransferBusinessToBusiness
        );
    }
}

const businessRouter = new BusinessRouter();

export default businessRouter;
