import { BalanceTransfer } from "../types/accounts.interface.js";
import { IIndexable } from "../types/indexable.interface.js";

class Validator {
    required(obj: IIndexable, mandatory_keys: string[]) {
        return mandatory_keys.every((key) => key in obj);
    }

    notExist(obj: IIndexable, mandatory_keys: string[]) {
        return mandatory_keys.every((key) => !(key in obj));
    }

    isPositive(num: number) {
        return num > 0;
    }

    isEmpty(arr: any[]) {
        return arr.length === 0;
    }

    isLessThan(limit: number, num: number) {
        return num <= limit;
    }

    isGreaterThan(threshold: number, num: number) {
        return num > threshold;
    }

    isNumeric(value: unknown) {
        return /^-?[0-9]+$/.test(String(value));
    }

    isValidLength(length_to_validate: number, input: string) {
        return input.length === length_to_validate;
    }

    isExist(arr: any[]) {
        return arr.every(Boolean);
    }

    hasMinSum(min: number, amounts: number[]) {
        const result = amounts.reduce((sum, amount) => {
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
