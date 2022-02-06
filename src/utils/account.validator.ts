import { ICreateIndividualDto } from "../modules/individual/individual.interface.js";
import { AccountTypes } from "../types/accounts.interface.js";

class AccountValidator {

    isActive = (accounts : ICreateIndividualDto[]) => {
        const result = accounts.every(account => account.status == 1);
        return result;
    };

    isTypeOf = (types : AccountTypes[], accounts : ICreateIndividualDto[]) => {
        const result = accounts.every(account => types.some(type => type == account.type));
        return result;
    };

    isSameCurrency = (currency : string, accounts : ICreateIndividualDto[]) => {
        const result = accounts.every(account => account.currency == currency);
        return result;
    };
}

const accountValidator = new AccountValidator();

export default accountValidator;