import express from "express";
import businessController from "./business.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";

class BusinessRouter {
    readonly router = express.Router();

    constructor() {
        this.router.get("/:id", raw(businessController.getBusinessAccountById));

        this.router.post("/", raw(businessController.createBusinessAccount));
        this.router.post(
            "/transfer/:source_id/business/:destination_id",
            raw(businessController.transferToBusiness)
        );
        this.router.post(
            "/transfer/:source_id/individual/:destination_id",
            raw(businessController.transferToIndividual)
        );
        this.router.post(
            "/FXtransfer/:source_id/business/:destination_id",
            raw(businessController.fxTransferBusinessToBusiness)
        );
    }
}

const businessRouter = new BusinessRouter();

export default businessRouter;
