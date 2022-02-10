import express, { Router } from "express";
import familyController from "./family.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";

/*    "/api/family"    */

class FamilyRouter {
    readonly router: Router;

    constructor() {
        this.router = express.Router();
        this.initRoutingFuncs();
    }

    private initRoutingFuncs() {
        // create a family account
        this.router.post("/", raw(familyController.createFamilyAccount));

        this.router.get("/:id", raw(familyController.getFamilyById));

        // add individual accounts to the family account
        this.router.patch(
            "/:id/addMembers",
            raw(familyController.addFamilyMembers)
        );

        // remove individual accounts from the family account
        this.router.patch(
            "/:id/removeMembers",
            raw(familyController.removeFamilyMembers)
        );

        // close family account --> delete or patch?
        this.router.patch(
            "/:id/closeAccount",
            raw(familyController.closeFamilyAccount)
        );

        // transfer from a family account to a business account having the same currency
        this.router.post(
            "/transfer/:source_id/business/:destination_id",
            raw(familyController.transferToBusiness)
        );
    }
}

const familyRouter = new FamilyRouter();

export default familyRouter;
