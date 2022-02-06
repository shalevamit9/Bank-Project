import express, { Router } from "express";
import familyController from "./family.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";

/*    "/api/family"    */

class FamilyRouter {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initRoutingFuncs();
    }

    private initRoutingFuncs() {
        // create a family account
        this.router.post("/", raw(familyController.createFamilyAccount));  // input: a list of accout primaryID values, currency
        
        // transfer from a family account to a business account having the same currency
        this.router.post("/transfer/:sourceId/business/:destinationId", raw(familyController.transferToBusiness)); // input: srcId, destId, a list of tuples (individual account ID, amount), amount to transfer

        // get family account details (short or full)
        this.router.get("/:id", raw(familyController.getFamilyDetails));  // input: the family account primaryID, "short"/"full" details level --> in query string

        // add individual accounts to the family account
        this.router.patch("/addMembers/:accountId", raw(familyController.addFamilyMembers)); // input: the family account primaryID, a list of individual account primaryIDs, short or full details
        
        // remove individual accounts from the family account
        this.router.patch("/removeMembers/:accountId", raw(familyController.removeFamilyMembers)); // input: the family account primaryID, a list of individual account primaryIDs

        // close family account --> delete or patch?
        this.router.patch("/:id", raw(familyController.closeAccount));
    }
}


const familyRouter = new FamilyRouter();

export default familyRouter;