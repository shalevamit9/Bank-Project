import express from "express";
import businessController from "./business.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";
import businessValidator from "./business.validator.js";

class BusinessRouter {
    readonly router = express.Router();

    constructor() {
        this.router.get(
            "/:id",
            raw(businessValidator.getBusiness),
            raw(businessController.getBusinessAccountById)
        );

        this.router.post(
            "/",
            raw(businessValidator.createBusiness),
            raw(businessController.createBusinessAccount)
        );
        this.router.post(
            "/transfer/:source_id/business/:destination_id",
            raw(businessValidator.transferToBusiness),
            raw(businessController.transferToBusiness)
        );
        this.router.post(
            "/transfer/:source_id/individual/:destination_id",
            raw(businessController.transferToIndividual)
        );
        this.router.post(
            "/FXtransfer/:source_id/business/:destination_id",
            raw(businessController.fxTransferToBusiness)
        );
    }
}

const businessRouter = new BusinessRouter();

export default businessRouter;
