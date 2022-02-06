export class Validator {
    isKeyExist(key_to_find: string, obj: Object): boolean {
        for (const key in obj) {
            if (key_to_find === key) {
                return true;
            }
        }

        return false;
    }

    isPositive(num: number): boolean {
        return num >= 0;
    }

    isEmpty(arr: any[]): boolean {
        return arr.length === 0;
    }

    isLessThan(limit: number, num: number): boolean {
        return num < limit;
    }

    isGreaterThan(threshold: number, num: number): boolean {
        return num >= threshold;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    isNumeric(value: any): boolean {
        return /^[0-9]+$/.test(String(value));
    }
}
