import { BadRequest } from "../exceptions/badRequest.exception.js";
import { BalanceTransfer, IAccount } from "../types/accounts.interface.js";

interface IDynamicObject {
    [key: string]: any;
}

class Validator {
    required(obj: IDynamicObject, mandatory_keys: string[]) {
        return mandatory_keys.every((key) => {
            if (!(key in obj)) {
                throw new BadRequest(`the request is missing ${key} value`);
            }
            return true;
        });
    }

    notExist(obj: IDynamicObject, mandatory_keys: string[]) {
        return mandatory_keys.every((key) => {
            if (key in obj) {
                throw new BadRequest(`the request is missing ${key} value`);
            }
            return true;
        });
    }

    isPositive(num: number) {
        if (num > 0) {
            return true;
        }
        throw new BadRequest(`value is not positive`);
    }

    isEmpty(arr: any[]) {
        if (arr.length !== 0) {
            return false;
        }
        throw new BadRequest(`value is not empty`);
    }

    isLessThan(limit: number, num: number) {
        if (num >= limit) {
            throw new BadRequest(`value is not less then ${limit}`);
        }
        return true;
    }

    isGreaterThan(threshold: number, num: number) {
        if (num < threshold) {
            throw new BadRequest(`value is not greater then ${threshold}`);
        }
        return true;
    }

    isNumeric(value: unknown) {
        if (/^-?[0-9]+$/.test(String(value))) {
            return true;
        }
        throw new BadRequest(`value is not numeric`);
    }

    length(length_to_validate: number, input: string | number) {
        if (String(input).length === length_to_validate) {
            return true;
        }
        throw new BadRequest("Length doesn't match");
    }

    isExist(accounts: IAccount[], amount: number) {
        if (accounts.length === amount) {
            return true;
        }
        throw new BadRequest(`value doesn't exist`);
    }

    // if need account property then use balance
    hasMinSum(min: number, amounts: number[]) {
        const result = amounts.reduce((sum: number, amount: number): number => {
            return sum + amount;
        }, 0);
        if (result >= min) {
            return true;
        }
        throw new BadRequest(`didn't passed minimum sum`);
    }

    hasMinimalRemainingBalance(
        min: number,
        balanceTransfers: BalanceTransfer[]
    ) {
        const result = balanceTransfers.every(
            (balanceTransfer) => balanceTransfer[0] - balanceTransfer[1] >= min
        );
        if (result) {
            return true;
        }
        throw new BadRequest(`remaining amount doesn't pass the minimum`);
    }
}

const validator = new Validator();

export default validator;
