import { RequestHandler } from "express";
import validator from "../../utils/validator.js";
import { IValidationResult } from "../../types/validation.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import { IUpdateAccount } from "./account.interface.js";
import businessRepository from "../business/business.repository.js";
import individualRepository from "../individual/individual.repository.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import {
    AccountStatuses,
    AccountTypes,
} from "../../types/accounts.interface.js";

class AccountValidator {
    changeAccountsStatus: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];
        const { action, accounts_ids } = req.body as IUpdateAccount;

        const current_status =
            action === "activate"
                ? AccountStatuses.Inactive
                : AccountStatuses.Active;

        // const individual_accounts_ids: number[] = accounts_ids
        //     .filter((account) => account[1] === AccountTypes.Individual)
        //     .map((account) => account[0]);

        // const business_accounts_ids: number[] = accounts_ids
        //     .filter((account) => account[1] === AccountTypes.Business)
        //     .map((account) => account[0]);

        const individual_accounts_ids = accounts_ids.reduce(
            (acc, account_tuple) => {
                if (account_tuple[1] !== AccountTypes.Individual) return acc;
                acc.push(account_tuple[0]);
                return acc;
            },
            [] as number[]
        );

        const business_accounts_ids = accounts_ids.reduce(
            (acc, account_tuple) => {
                if (account_tuple[1] !== AccountTypes.Business) return acc;
                acc.push(account_tuple[0]);
                return acc;
            },
            [] as number[]
        );

        const business_accounts = await businessRepository.getBusinesses(
            business_accounts_ids
        );
        const individual_accounts = await individualRepository.getIndividuals(
            individual_accounts_ids
        );

        if (
            !validator.isExist([...individual_accounts, ...business_accounts])
        ) {
            throw new BadRequest("at least one of the accounts doesn't exist");
        }

        results.push({
            is_valid: !validator.isEmpty(accounts_ids),
            message: "accounts list should not be empty",
        });
        results.push({
            is_valid: accounts_ids.every((account) => validator.isNumeric(account[0])),
            message: "the provided accounts IDs should be numeric",
        });
        results.push({
            is_valid: [...individual_accounts, ...business_accounts].every(
                (account) => account.status === current_status
            ),
            message: "at least one of the accounts is not in the proper status",
        });
        results.push({
            is_valid:
                individual_accounts_ids.length +
                    business_accounts_ids.length ===
                accounts_ids.length,
            message:
                "the provided accounts are not allowed to be of type family",
        });

        validationResultsHandler(results);

        next();
    };
}

const accountValidator = new AccountValidator();

export default accountValidator;
