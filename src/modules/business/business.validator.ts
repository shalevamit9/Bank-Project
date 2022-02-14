import { Request, Response, RequestHandler, NextFunction } from "express";
import validator from "../../utils/validator.js";
import accountValidatorUtil from "../../utils/account.validation.utils.js";
import { IBusinessAccount } from "./business.interface.js";
import businessRepository from "./business.repository.js";
import { AccountTypes } from "../../types/accounts.interface.js";
import { IValidationResult } from "../../types/validation.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import individualRepository from "../individual/individual.repository.js";
import config from "../../config/config.js";

class BusinessValidator {
    business_minimum_allowed_balance : number = config.BUSINESS_MINIMUM_ALLOWED_BALANCE;

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
            is_valid: validator.isValidLength(8, String(business_dto.company_id)),
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
        const results: IValidationResult[] = [];
        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: "account_id is required",
        });
        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: "account_id has to be numeric",
        });
        validationResultsHandler(results);

        next();
    };

    transferToBusiness: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const results: IValidationResult[] = [];
        const accounts = await Promise.all([
            businessRepository.getBusinessById(Number(req.params.source_id)),
            businessRepository.getBusinessById(
                Number(req.params.destination_id)
            ),
        ]);

        results.push({
            is_valid: validator.isExist(accounts),
            message: "At least one account doesn't exist",
        });
        const [source_account, destination_account] = accounts;
        results.push({
            is_valid: accountValidatorUtil.isActive(accounts),
            message: "At least one account is not active",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Business],
                accounts
            ),
            message: "Both accounts have to be of type business",
        });
        results.push({
            is_valid: accountValidatorUtil.isSameCurrency(source_account.currency, [
                destination_account,
            ]),
            message: "Both accounts need to have the same currency",
        });

        const { amount: amountStr } = req.body;
        const amount = Number(amountStr);
        results.push({
            is_valid: validator.isNumeric(amount),
            message: "amount is not numeric",
        });
        results.push({
            is_valid: validator.isPositive(amount),
            message: "amount is not positive",
        });
        results.push({
            is_valid: validator.hasMinimalRemainingBalance(this.business_minimum_allowed_balance, [
                [source_account.balance, amount],
            ]),
            message: "source account doesn't have enough remaining balance",
        });
        validationResultsHandler(results);

        next();
    };

    transferToIndividual: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const results: IValidationResult[] = [];
        const accounts = await Promise.all([
            businessRepository.getBusinessById(Number(req.params.source_id)),
            individualRepository.getIndividualById(
                Number(req.params.destination_id)
            ),
        ]);

        results.push({
            is_valid: validator.isExist(accounts),
            message: "At least one account doesn't exist",
        });
        const [source_account, destination_account] = accounts;
        results.push({
            is_valid: accountValidatorUtil.isActive(accounts),
            message: "At least one account is not active",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Business, AccountTypes.Individual],
                accounts
            ),
            message:
                "source can only be business account and destination can only be individual account",
        });
        results.push({
            is_valid: accountValidatorUtil.isSameCurrency(source_account.currency, [
                destination_account,
            ]),
            message: "Both accounts need to have the same currency",
        });

        const { amount: amountStr } = req.body;
        const amount = Number(amountStr);
        results.push({
            is_valid: validator.isNumeric(amount),
            message: "amount is not numeric",
        });
        results.push({
            is_valid: validator.isPositive(amount),
            message: "amount is not positive",
        });
        results.push({
            is_valid: validator.hasMinimalRemainingBalance(this.business_minimum_allowed_balance, [
                [source_account.balance, amount],
            ]),
            message: "source account doesn't have enough remaining balance",
        });
        validationResultsHandler(results);

        next();
    };

    FXTransferToBusiness: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const results: IValidationResult[] = [];
        const accounts = await Promise.all([
            businessRepository.getBusinessById(Number(req.params.source_id)),
            businessRepository.getBusinessById(
                Number(req.params.destination_id)
            ),
        ]);

        results.push({
            is_valid: validator.isExist(accounts),
            message: "At least one account doesn't exist",
        });
        const [source_account] = accounts;
        results.push({
            is_valid: accountValidatorUtil.isActive(accounts),
            message: "At least one account is not active",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Business],
                accounts
            ),
            message: "Both accounts have to be of type business",
        });

        const { amount: amount_str } = req.body;
        const amount = Number(amount_str);
        results.push({
            is_valid: validator.isNumeric(amount),
            message: "amount is not numeric",
        });
        results.push({
            is_valid: validator.isPositive(amount),
            message: "amount is not positive",
        });
        results.push({
            is_valid: validator.hasMinimalRemainingBalance(this.business_minimum_allowed_balance, [
                [source_account.balance, amount],
            ]),
            message: "source account doesn't have enough remaining balance",
        });
        validationResultsHandler(results);

        next();
    };
}

const businessValidator = new BusinessValidator();

export default businessValidator;
