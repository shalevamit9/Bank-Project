import { RequestHandler } from "express";
import validator from "../../utils/validator.js";
import { IValidationResult } from "../../types/validation.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import { IUpdateAccount } from "./account.interface.js";
import accountRepository from "./account.repository.js";
import {
    AccountStatuses,
    AccountTypes,
    IAccount,
} from "../../types/accounts.interface.js";

class AccountValidator {
    isActive(accounts: IAccount[]) {
        const result = accounts.every(
            (account) => account.status === AccountStatuses.Active
        );
        return result;
    }

    isTypeOf(types: AccountTypes[], accounts: Partial<IAccount>[]) {
        const result = accounts.every((account) =>
            types.some((type) => type === account.type)
        );
        return result;
    }

    isSameCurrency(currency: string, accounts: IAccount[]) {
        const result = accounts.every(
            (account) => account.currency === currency
        );
        return result;
    }

    changeAccountsStatus: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];
        const { action, accounts_ids } = req.body as IUpdateAccount;

        const current_status =
            action === "activate"
                ? AccountStatuses.Inactive
                : AccountStatuses.Active;
        const accounts_statuses = await accountRepository.getAccountsStatuses(
            accounts_ids
        );

        results.push({
            is_valid: !validator.isEmpty(accounts_ids),
            message: "accounts list should not be empty",
        });
        results.push({
            is_valid: accounts_ids.every((id) => validator.isNumeric(id)),
            message: "the provided accounts IDs should be numeric",
        });
        results.push({
            is_valid: accounts_statuses.length === accounts_ids.length,
            message: "at least one of the accounts doesn't exist",
        });
        results.push({
            is_valid: accounts_statuses.every(
                (account) => account[1] === current_status
            ),
            message: "at least one of the accounts is not in the proper status",
        });
        results.push({
            is_valid: accountValidator.isTypeOf(
                [AccountTypes.Individual, AccountTypes.Business],
                accounts_statuses.map((account) => {
                    return {
                        account_id: account[0],
                        status: account[1],
                        type: account[2],
                    };
                })
            ),
            message:
                "the provided accounts are not allowed to be of type family",
        });

        validationResultsHandler(results);

        next();
    };
}

const accountValidator = new AccountValidator();

export default accountValidator;
