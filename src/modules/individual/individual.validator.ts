import { Request, Response, RequestHandler, NextFunction } from "express";
import validator from "../../utils/validator.js";
import { IIndividualAccountDto } from "./individual.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import { IValidationResult } from "../../types/validation.interface.js";

class IndividualValidator {
    createIndividual: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        const results: IValidationResult[] = [];
        const individual_dto : IIndividualAccountDto = req.body;
        const mandatory_keys = ["individual_id","first_name","last_name","currency"];

        results.push({
            is_valid: validator.required(individual_dto, mandatory_keys),
            message: `At least one of the following properties are missing [${mandatory_keys.toString()}]`,
        });
        results.push({
            is_valid: validator.notExist(individual_dto, ["individual_account_id"]),
            message: "individual_account_id can't be exist",
        });
        results.push({
            is_valid: validator.length(7, String(individual_dto.individual_id)),
            message: "individual_id length is not 7",
        });
        results.push({
            is_valid: validator.isNumeric(individual_dto.individual_id),
            message: "individual_id is not numeric",
        });
        results.push({
            is_valid: validator.isGreaterThan(1000000, Number(individual_dto.individual_id)),
            message: "individual_id is not greater than 1000000",
        });
        
        validationResultsHandler(results);

        next();
    };

    getIndividual: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        const results: IValidationResult[] = [];
        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: `id property is missing `,
        });
        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: `individual_id is not numeric`,
        });
        
        validationResultsHandler(results);

        next();
    };
}

const individualValidator = new IndividualValidator();

export default individualValidator;
