import express, { Router } from "express";
import familyController from "./family.controller.js";

/*    "/api/family"    */

class FamilyRouter {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initRoutingFuncs();
    }

    private initRoutingFuncs() {
        // create a family account
        this.router.post("/", familyController.createFamilyAccount);  // input: a list of accout primaryID values, currency
        
        // transfer from a family account to a business account having the same currency
        this.router.post("/transfer/:sourceId/business/:destinationId", familyController.transferToBusiness); // input: srcId, destId, a list of tuples (individual account ID, amount), amount to transfer
        
        // get family account SHORT details
        this.router.get("/:id/short", familyController.getShortFamilyDetails);  // input: the family account primaryID
        
        // get family account FULL details
        this.router.get("/:id/full", familyController.getFullFamilyDetails);  // input: the family account primaryID

        // add individual accounts to the family account
        this.router.patch("/addMembers/:accountId", familyController.addFamilyMembers); // input: the family account primaryID, a list of individual account primaryIDs
        
        // remove individual accounts from the family account
        this.router.patch("/removeMembers/:accountId", familyController.removeFamilyMembers); // input: the family account primaryID, a list of individual account primaryIDs

        // close family account --> delete or patch?
        this.router.patch("/:id", familyController.closeAccount);
    }
}


const familyRouter = new FamilyRouter();

export default familyRouter;