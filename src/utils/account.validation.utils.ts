import {
    AccountTypes,
    IAccount,
    AccountStatuses,
} from "../types/accounts.interface.js";

class AccountValidatorUtil {
    isActive(accounts: IAccount[]) {
        const result = accounts.every(
            (account) => account.status === AccountStatuses.Active
        );
        return result;
    }

    isTypeOf(types: AccountTypes[], accounts: IAccount[]) {
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

const accountValidatorUtil = new AccountValidatorUtil();

export default accountValidatorUtil;
