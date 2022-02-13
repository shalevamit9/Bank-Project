import express, { Router } from "express";
import familyController from "./family.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";
import familyValidator from "./family.validator.js";

class FamilyRouter {
    readonly router: Router;

    constructor() {
        this.router = express.Router();
        this.initRoutingFuncs();
    }

    private initRoutingFuncs() {
        this.router.post(
            "/",
            raw(familyValidator.createFamily),
            raw(familyController.createFamilyAccount)
        );

        this.router.get(
            "/:id",
            raw(familyValidator.getFamily),
            raw(familyController.getFamilyById)
        );

        this.router.patch(
            "/:id/addMembers",
            raw(familyValidator.addFamilyMembers),
            raw(familyController.addFamilyMembers)
        );

        this.router.patch(
            "/:id/removeMembers",
            raw(familyValidator.removeFamilyMembers),
            raw(familyController.removeFamilyMembers)
        );

        this.router.patch(
            "/:id/closeAccount",
            raw(familyValidator.closeFamilyAccount),
            raw(familyController.closeFamilyAccount)
        );

        this.router.post(
            "/transfer/:source_id/business/:destination_id",
            raw(familyValidator.transferToBusiness),
            raw(familyController.transferToBusiness)
        );
    }
}

const familyRouter = new FamilyRouter();

export default familyRouter;
