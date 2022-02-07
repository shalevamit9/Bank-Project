
import { Request, Response, RequestHandler, NextFunction } from "express";
import { IIndividualAccountDto } from "./individual.interface.js";
import { IBusinessAccountDto } from "./individual.interface.js";
import validator from "../../utils/validator.js";
import accountValidator from "../../utils/account.validator.js";
import businessService from "../business/business.service.js";
import individualService from "../individual/individual.service.js";
import { IBusinessAccount } from "./business.interface.js";
import { AccountTypes } from "../../types/accounts.interface.js";

class IndividualValidator {
    createBusiness: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        const business_dto : IBusinessAccount= req.body;
        validator.required(business_dto, ["company_id","company_name","currency"]);
        validator.isGreaterThan(1000000, Number(business_dto.company_id));
        validator.length(8, business_dto.company_id);

        next();
    };

    getBusiness: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        const business_dto : IBusinessAccount= req.body;
        validator.required(business_dto, ["business_account_id"]);
        validator.isNumeric(business_dto.business_account_id);

        next();
    };


    transferToBusiness: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const source_business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.source_id));
        const destination_business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.destination_id));
        validator.isExist([source_business_dto, destination_business_dto], 2);
        accountValidator.isActive([source_business_dto, destination_business_dto]);
        accountValidator.isTypeOf([AccountTypes.Business], [source_business_dto, destination_business_dto]);
        accountValidator.isSameCurrency(source_business_dto.currency, [destination_business_dto]);
        validator.isNumeric(req.body.amount);
        validator.isPositive(Number(req.body.amount));
        validator.hasMinimalRemainingBalance(10000, [[source_business_dto.balance, Number(req.body.amount)]]);

        next();
    };

    transferToIndividual: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.source_id));
        const individual_dto : IIndividualAccountDto = await individualService.getIndividualById(Number(req.params.destination));
        validator.isExist([business_dto, individual_dto], 2);
        accountValidator.isActive([business_dto, individual_dto]);
        accountValidator.isTypeOf([AccountTypes.Business], [business_dto]);
        accountValidator.isTypeOf([AccountTypes.Individual], [individual_dto]);
        accountValidator.isSameCurrency(business_dto.currency, [individual_dto]);
        validator.isNumeric(req.body.amount);
        validator.isPositive(Number(req.body.amount));
        validator.hasMinimalRemainingBalance(10000, [[business_dto.balance, Number(req.body.amount)]]);

        next();
    };

    FXTransferToBusiness: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const source_business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.source_id));
        const destination_business_dto : IBusinessAccount = await businessService.getBusinessAccountById(Number(req.params.destination_id));
        validator.isExist([source_business_dto, destination_business_dto], 2);
        accountValidator.isActive([source_business_dto, destination_business_dto]);
        accountValidator.isTypeOf([AccountTypes.Business], [source_business_dto, destination_business_dto]);
        accountValidator.isSameCurrency(source_business_dto.currency, [destination_business_dto]);
        validator.isNumeric(req.body.amount);
        validator.isPositive(Number(req.body.amount));
        validator.hasMinimalRemainingBalance(10000, [[source_business_dto.balance, Number(req.body.amount)]]);

        next();
    };
}

const individualValidator = new IndividualValidator();

export default individualValidator;
