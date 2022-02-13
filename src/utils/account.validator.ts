import {
    AccountTypes,
    IAccount,
    AccountStatuses,
} from "../types/accounts.interface.js";

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
}

const accountValidator = new AccountValidator();

export default accountValidator;
