import { RequestHandler } from "express-serve-static-core";
import { ResponseMessage } from "../../types/messages.interface.js";
import { IUpdateAccount } from "./account.interface.js";
import accountService from "./account.service.js";

class AccountController {
    changeAccountsStatuses: RequestHandler = async (req, res) => {
        const { action, accounts_ids } = req.body as IUpdateAccount;

        const result = await accountService.changeAccountsStatuses(
            accounts_ids,
            action
        );

        const response: ResponseMessage = {
            status: 200,
            message: "success",
            data: { result },
        };
        res.status(response.status).json(response);
    };
}

const accountController = new AccountController();
export default accountController;
