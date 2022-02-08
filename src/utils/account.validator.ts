import {
    AccountTypes,
    IAccount,
    AccountStatuses,
} from "../types/accounts.interface.js";
import { BadRequest } from "../exceptions/badRequest.exception.js";

class AccountValidator {
    isActive(accounts: IAccount[]) {
        const result = accounts.every(
            (account) => account.status === AccountStatuses.Active
        );
        if(result) {
            return true;
        }
        throw new BadRequest(`is not active`);
    }

    isTypeOf(types: AccountTypes[], accounts: IAccount[]) {
        const result = accounts.every((account) =>
            types.some((type) => type === account.type)
        );
        if(result) {
            return true;
        }
        throw new BadRequest(`is not type of ${types[0]}`);
    }

    isSameCurrency(currency: string, accounts: IAccount[]) {
        const result = accounts.every(
            (account) => account.currency === currency
        );
        if(result) {
            return true;
        }
        throw new BadRequest(`is not the same currency as ${currency}`);
    }
}

const accountValidator = new AccountValidator();

export default accountValidator;
