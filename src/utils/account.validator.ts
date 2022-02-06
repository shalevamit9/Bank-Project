import { AccountTypes, IAccount } from "../types/accounts.interface.js";

class AccountValidator {

    isActive = (accounts : IAccount[]) => {
        const result = accounts.every(account => account.status == 1);
        return result;
    };

    isTypeOf = (types : AccountTypes[], accounts : IAccount[]) => {
        const result = accounts.every(account => types.some(type => type == account.type));
        return result;
    };

    isSameCurrency = (currency : string, accounts : IAccount[]) => {
        const result = accounts.every(account => account.currency == currency);
        return result;
    };
}

const accountValidator = new AccountValidator();

export default accountValidator;