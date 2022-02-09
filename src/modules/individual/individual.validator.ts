import { Request, Response, RequestHandler, NextFunction } from "express";
import validator from "../../utils/validator.js";
import individualService from "./individual.service.js";
import individualRepository from "./individual.repository.js";
import { IIndividualAccountDto, IIndividualAccount } from "./individual.interface.js";

class IndividualValidator {
    createIndividual: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            const individual_dto : IIndividualAccountDto = req.body;
            validator.required(individual_dto, ["individual_id","first_name","last_name","currency"]);
            validator.notExist(individual_dto, ["individual_account_id"]);
            validator.length(7, String(individual_dto.individual_id));
            validator.isNumeric(individual_dto.individual_id)
            validator.isGreaterThan(1000000, Number(individual_dto.individual_id));

            const individual = await individualRepository.getIndividualById(Number(individual_dto.individual_id));
            if(!individual) throw new Error("individual doesn't exist");
            
            validator.isExist([individual],0)

            next();
        };

    getIndividual: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
            const individual_dto : IIndividualAccountDto = req.body;
            validator.required(individual_dto, ["individual_account_id"]);
            validator.isNumeric(individual_dto.individual_id);

            next();
        };
}

const individualValidator = new IndividualValidator();

export default individualValidator;
