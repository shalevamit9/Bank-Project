import express, { Router } from "express";
import accountValidator from "./account.validator.js";
import accountController from "./account.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";

class AccountRouter {
    readonly router: Router;

    constructor() {
        this.router = express.Router();

        this.router.patch(
            "/updateStatus",
            raw(accountValidator.changeAccountsStatus),
            raw(accountController.changeAccountsStatuses)
        );
    }
}

const accountRouter = new AccountRouter();

export default accountRouter;
