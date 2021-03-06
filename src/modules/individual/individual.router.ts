import express from "express";
import individualController from "./individual.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";
import individualValidator from "./individual.validator.js";

class IndividualRouter {
    readonly router = express.Router();

    constructor() {
        this.router.get(
            "/:id",
            raw(individualValidator.getIndividual),
            raw(individualController.getIndividualById)
        );

        this.router.post(
            "/",
            raw(individualValidator.createIndividual),
            raw(individualController.createIndividualAccount)
        );
 
        this.router.post(
            "/transfer/:source_id/family/:destination_id",
            raw(individualValidator.transferToFamily),
            raw(individualController.transferToFamily)
        );
    }
}

const individualRouter = new IndividualRouter();

export default individualRouter;
