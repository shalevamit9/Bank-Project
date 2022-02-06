import { BalanceTransfer, IAccount } from "../types/accounts.interface.js";

class Validator {
    required(obj: Object, mandatory_keys: string[]) {
        return mandatory_keys.every((key) => key in obj);
    }

    isPositive(num: number) {
        return num >= 0;
    }

    isEmpty(arr: any[]) {
        return arr.length === 0;
    }

    isLessThan(limit: number, num: number) {
        return num < limit;
    }

    isGreaterThan(threshold: number, num: number) {
        return num >= threshold;
    }

    isNumeric(value: unknown) {
        return /^[0-9]+$/.test(String(value));
    }

    length(length_to_validate: number, input: string | number) {
        if (typeof input === "string" || typeof input === "number") {
            return String(input).length === length_to_validate;
        }

        return false;
    }

    isExist(accounts: IAccount[], amount: number) {
        return accounts.length === amount;
    }

    // if need account property then use balance
    hasMinSum(min: number, amounts: number[]) {
        const result = amounts.reduce((sum: number, amount: number): number => {
            return sum + amount;
        }, 0);
        return result >= min;
    }

    hasMinimalRemainingBalance(
        min: number,
        balanceTransfers: BalanceTransfer[]
    ) {
        const result = balanceTransfers.every(
            (balanceTransfer) => balanceTransfer[0] - balanceTransfer[1] >= min
        );
        return result;
    }
}

const validator = new Validator();

export default validator;
