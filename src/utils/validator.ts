import { IBalanceTransfer,
    IAccount,
} from "../types/accounts.interface.js";

class Validator {
    isPositive = (number: number) => {};

    isEmpty = (array: any[]) => {};

    lowerThan = (validate_number: number, amount: number) => {};

    length = (length_to_validate: number, input: string | number) => {
        if (typeof input === "string" || typeof input === "number") {
            return String(input).length === length_to_validate;
        }

        return false;
    };

    greaterThan = (validate_numver: number, amount: number) => {};

    isNumeric = (val: any) => {};

    isExist = (accounts: IAccount[], amount: number) => {
        return accounts.length === amount;
    };

    // if need account property then use balance
    hasMinSum = (min: number, amounts: number[]) => {
        const result = amounts.reduce((sum: number, amount: number): number => {
            return sum + amount;
        }, 0);
        return result >= min;
    };

    hasMinBalance = (min: number, balanceTransfers: IBalanceTransfer[]) => {
        const result = balanceTransfers.every(tup => (tup[0] - tup[1]) >= min);
        return result;
    };
}

const validator = new Validator();

export default validator;
