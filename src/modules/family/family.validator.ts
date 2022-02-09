import { Request, Response, RequestHandler, NextFunction } from "express";
import validator from "../../utils/validator.js";
import individualService from "../individual/individual.service.js";
import familyService from "./family.service.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { IFamilyAccountDto } from "./family.interface.js";
import { IIndividualAccountDto } from "../individual/individual.interface.js";
import accountValidator from "../../utils/account.validator.js";
import { AccountTypes, BalanceTransfer } from "../../types/accounts.interface.js";
import { amountTransfer } from "../../types/accounts.interface.js";
import { IFamilyCreate } from "./family.interface.js";
import businessService from "../business/business.service.js";
import businessRepository from "../business/business.repository.js";
import { IBusinessAccount } from "../business/business.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import { IValidationResult } from "../../types/validation.interface.js";

class FamilyValidator {
    createFamily: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const results: IValidationResult[] = [];
        const family_dto : IFamilyCreate= req.body;
        results.push({
            is_valid: validator.required(family_dto, ["owners","currency"]),
            message: "owners property is missing",
        });
        results.push({
            is_valid: validator.notExist(family_dto, ["family_account_id"]),
            message: "family_account_id is not belong to the input property",
        });

        const pending_users : Promise<IIndividualAccountDto>[] = family_dto.owners.map(async owner => await individualService.getIndividualById(Number(owner[0])));
        const users : IIndividualAccountDto[] = await Promise.all(pending_users);
        results.push({
            is_valid: validator.isExist(users,family_dto.owners.length),
            message: "at least one of the users doesn't matching the family owners",
        });
        results.push({
            is_valid: accountValidator.isActive(users),
            message: "at least one of the users is not active",
        });
        results.push({
            is_valid: accountValidator.isTypeOf([AccountTypes.Individual], users),
            message: "at least one of the users is not type of individual",
        });
        results.push({
            is_valid: accountValidator.isSameCurrency(family_dto.currency, users),
            message: "at least one of the users doesn't have the same currency as the family",
        });
        results.push({
            is_valid: validator.hasMinSum(5000, family_dto.owners.map(owner=> owner[1])),
            message: "the sum of all the users amount is less then 5,000 therefore not enougth",
        });

        const balance_tuples : BalanceTransfer[] = users.map((user,i) => [user.balance,family_dto.owners[i][1]]);

        validator.hasMinimalRemainingBalance(1000, balance_tuples);

        next();
    };

    getFamily: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
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

    transferToBusiness: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const results: IValidationResult[] = [];
        const family_dto : IFamilyAccountDto= familyService.getFamilyById(Number(req.params.sourceId));
        const pending_users : Promise<IIndividualAccountDto>[] = family_dto.owners.map(async owner => await individualService.getIndividualById(Number(owner[0])));
        const users : IIndividualAccountDto[] = await Promise.all(pending_users);

        results.push({
            is_valid: validator.isExist(users,family_dto.owners.length),
            message: "",
        });
        results.push({
            is_valid: accountValidator.isActive(users),
            message: "at least one of the family owners is not active",
        });
        results.push({
            is_valid: accountValidator.isTypeOf([AccountTypes.Family], [family_dto]),
            message: "source_id is not represent a family id",
        });
        results.push({
            is_valid: accountValidator.isTypeOf([AccountTypes.Individual], users),
            message: "at least one user in the list of users is not type of individual",
        });

        const destination : IBusinessAccount = await businessRepository.getBusinessById(Number(req.params.destinationId));

        results.push({
            is_valid: accountValidator.isTypeOf([AccountTypes.Business], [destination]),
            message: "destination id is not type of business",
        });
        results.push({
            is_valid: validator.isPositive(Number(req.body.amount)),
            message: "amount is not positive",
        });
        results.push({
            is_valid: accountValidator.isSameCurrency(family_dto.currency, [destination]),
            message: "the business id doesn't have the same currency as the family",
        });
        results.push({
            is_valid: validator.hasMinimalRemainingBalance(5000, [[Number(family_dto.balance), Number(req.body.amount)]]),
            message: "family is not allow to transfer this amount",
        });
        results.push({
            is_valid: validator.isLessThan(5000, Number(req.body.amount)),
            message: "the maximum amount that family can transfer at once is 5,000",
        });

        validationResultsHandler(results);

        next();
    };

    addFamilyMembers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const results: IValidationResult[] = [];
        const input_tup : amountTransfer[]= req.body.individual_accounts;

        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: "id property is missing",
        });
        results.push({
            is_valid: validator.isEmpty(input_tup),
            message: "list_of_individual is empty",
        });
        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: "id is not numeric",
        });
        results.push({
            is_valid: input_tup.every((id, amount) => validator.isPositive(amount)),
            message: "at least one of the amount in the tuple is not a positive number",
        });

        const family_dto : IFamilyAccountDto= familyService.getFamilyById(Number(req.params.sourceId));
        const pending_users : Promise<IIndividualAccountDto>[] = family_dto.owners.map(async owner => await individualService.getIndividualById(Number(owner[0])));
        const users : IIndividualAccountDto[] = await Promise.all(pending_users);

        results.push({
            is_valid: accountValidator.isSameCurrency(family_dto.currency, users),
            message: "at least one of the users doesn't have the same currency as the family",
        });
        results.push({
            is_valid: accountValidator.isTypeOf([AccountTypes.Individual], users),
            message: "at least one of the users is not type of individual",
        });
        results.push({
            is_valid: accountValidator.isActive(users),
            message: "at least one of the users is not active",
        });
        
        validationResultsHandler(results);

        next();
    };

    removeFamilyMembers: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        const results: IValidationResult[] = [];
        const input_tup : amountTransfer[]= req.body.individual_accounts;
        const family_dto : IFamilyAccountDto= familyService.getFamilyById(Number(req.params.sourceId));
        results.push({
            is_valid: validator.isEmpty(input_tup),
            message: `array of id and amount tuple is empty`,
        });
        results.push({
            is_valid: input_tup.every((id, amount)=> validator.isNumeric(id) && validator.isPositive(amount)),
            message: `at least one of the amount in the tuple is not numeric or a positive amount`,
        });
        results.push({
            is_valid: family_dto.owners.every(owner=> {
                return input_tup.some(id=> id === owner.individual_id);
            }),
            message: `at least one of the id in the tuple is not matching a user`,
        });

        validationResultsHandler(results);

        next();
    };

    closeFamilyAccount: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
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

const familyValidator = new FamilyValidator();

export default familyValidator;
