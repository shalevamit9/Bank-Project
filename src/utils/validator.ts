class Validator {
    required(obj: Object, mandatory_keys: string[]) {
        return mandatory_keys.every((key) => key in obj);
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

    isNumeric(value: unknown): boolean {
        return /^[0-9]+$/.test(String(value));
    }
}

const validator = new Validator();

export default validator;
