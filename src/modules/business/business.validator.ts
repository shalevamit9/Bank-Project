import { Request, Response, RequestHandler, NextFunction } from "express";
// import { IIndividualAccountDto } from "./individual.interface.js";
// import { IBusinessAccountDto } from "./individual.interface.js";
import validator from "../../utils/validator.js";
import accountValidator from "../../utils/account.validator.js";
// import businessService from "../business/business.service.js";
// import individualService from "../individual/individual.service.js";
import { IBusinessAccount } from "./business.interface.js";
import businessRepository from "./business.repository.js";
import { AccountTypes } from "../../types/accounts.interface.js";
import { IValidationResult } from "../../types/validation.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";

class BusinessValidator {
    createBusiness: RequestHandler = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const results: IValidationResult[] = [];
        const business_dto: IBusinessAccount = req.body;
        const mandatory_keys = ["company_id", "company_name", "currency"];
        results.push({
            is_valid: validator.required(business_dto, mandatory_keys),
            message: `At least one of the following properties are missing [${mandatory_keys.toString()}]`,
        });
        results.push({
            is_valid: validator.isNumeric(business_dto.company_id),
            message: "company_id is not numeric",
        });
        results.push({
            is_valid: validator.isGreaterThan(
                10000000,
                Number(business_dto.company_id)
            ),
            message: "company_id is not greater than 10000000",
        });
        results.push({
            is_valid: validator.length(8, String(business_dto.company_id)),
            message: "company_id length is not 8",
        });
        validationResultsHandler(results);

        next();
    };

    getBusiness: RequestHandler = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        validator.required(req.params, ["id"]);
        validator.isNumeric(req.params.id);

        next();
    };

    transferToBusiness: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const accounts = await Promise.all([
            businessRepository.getBusinessById(Number(req.params.source_id)),
            businessRepository.getBusinessById(
                Number(req.params.destination_id)
            ),
        ]);

        if (!accounts) throw new Error(`Accounts doesn't exist`);

        const [source_account, destination_account] = accounts;
        validator.isExist(accounts, 2);
        accountValidator.isActive(accounts);
        accountValidator.isTypeOf([AccountTypes.Business], accounts);
        accountValidator.isSameCurrency(source_account.currency, [
            destination_account,
        ]);

        const { amount: amountStr } = req.body;
        const amount = Number(amountStr);
        validator.isNumeric(amount);
        validator.isPositive(amount);
        validator.hasMinimalRemainingBalance(10000, [
            [source_account.balance, amount],
        ]);

        next();
    };

    // transferToIndividual: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //     const business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.source_id));
    //     const individual_dto : IIndividualAccountDto = await individualService.getIndividualById(Number(req.params.destination));
    //     validator.isExist([business_dto, individual_dto], 2);
    //     accountValidator.isActive([business_dto, individual_dto]);
    //     accountValidator.isTypeOf([AccountTypes.Business], [business_dto]);
    //     accountValidator.isTypeOf([AccountTypes.Individual], [individual_dto]);
    //     accountValidator.isSameCurrency(business_dto.currency, [individual_dto]);
    //     validator.isNumeric(req.body.amount);
    //     validator.isPositive(Number(req.body.amount));
    //     validator.hasMinimalRemainingBalance(10000, [[business_dto.balance, Number(req.body.amount)]]);

    //     next();
    // };

    // FXTransferToBusiness: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //     const source_business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.source_id));
    //     const destination_business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.destination_id));
    //     validator.isExist([source_business_dto, destination_business_dto], 2);
    //     accountValidator.isActive([source_business_dto, destination_business_dto]);
    //     accountValidator.isTypeOf([AccountTypes.Business], [source_business_dto, destination_business_dto]);
    //     accountValidator.isSameCurrency(source_business_dto.currency, [destination_business_dto]);
    //     validator.isNumeric(req.body.amount);
    //     validator.isPositive(Number(req.body.amount));
    //     validator.hasMinimalRemainingBalance(10000, [[source_business_dto.balance, Number(req.body.amount)]]);

    //     next();
    // };
}

const businessValidator = new BusinessValidator();

export default businessValidator;
