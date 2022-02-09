import { IValidationResult } from "../types/validation.interface.js";

export function checkValidationResults(results: IValidationResult[]): void {
    const errors = results.reduce((acc, result) => {
        if (!result.is_valid) acc.push(`${result.message}\n`);
        return acc;
    }, [] as string[]);
    if (errors.length !== 0) throw new Error(errors.toString());
}
