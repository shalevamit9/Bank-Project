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
import { IBusinessAccount } from "../business/business.interface.js";

class FamilyValidator {
    createFamily: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const family_dto : IFamilyCreate= req.body;
        validator.required(family_dto, ["owners","currency"]);
        const pending_users : Promise<IIndividualAccountDto>[] = family_dto.owners.map(async owner => await individualService.getIndividualById(Number(owner[0])));
        const users : IIndividualAccountDto[] = await Promise.all(pending_users);
        validator.isExist(users,family_dto.owners.length)
        accountValidator.isActive(users);
        accountValidator.isTypeOf([AccountTypes.Individual], users);
        accountValidator.isSameCurrency(family_dto.currency, users);
        validator.hasMinSum(5000, family_dto.owners.map(owner=> owner[1]));
        const balance_tuples : BalanceTransfer[] = users.map((user,i) => [user.balance,family_dto.owners[i][1]]);
        validator.hasMinimalRemainingBalance(1000, balance_tuples);

        next();
    };

    getFamily: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        validator.required(req.params, ["id"]);
        validator.isNumeric(req.params.id);
        
        next();
    };
    
    transferToBusiness: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const family_dto : IFamilyAccountDto= familyService.getFamilyById(Number(req.params.sourceId));
        const pending_users : Promise<IIndividualAccountDto>[] = family_dto.owners.map(async owner => await individualService.getIndividualById(Number(owner[0])));
        const users : IIndividualAccountDto[] = await Promise.all(pending_users);
        validator.isExist(users,family_dto.owners.length)
        accountValidator.isActive(users);
        accountValidator.isTypeOf([AccountTypes.Family], [family_dto]);
        accountValidator.isTypeOf([AccountTypes.Individual], users);
        const destination : IBusinessAccount = businessService.getBusinessAccountById(Number(req.params.destinationId));
        accountValidator.isTypeOf([AccountTypes.Business], [destination]);
        validator.isPositive(Number(req.body.amount));
        accountValidator.isSameCurrency(family_dto.currency, [destination]);
        validator.hasMinimalRemainingBalance(5000, [[Number(family_dto.balance), Number(req.body.amount)]]);
        validator.isLessThan(5000, Number(req.body.amount));

        next();
    };

    addFamilyMembers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        validator.required(req.params, ["id"]);
        const input_tup : amountTransfer= req.body.list_of_individuals;
        validator.isEmpty(input_tup);
        validator.isNumeric(req.params.id);
        input_tup.every((id, amount) => validator.isPositive(amount));
        const family_dto : IFamilyAccountDto= familyService.getFamilyById(Number(req.params.sourceId));
        const pending_users : Promise<IIndividualAccountDto>[] = family_dto.owners.map(async owner => await individualService.getIndividualById(Number(owner[0])));
        const users : IIndividualAccountDto[] = await Promise.all(pending_users);
        accountValidator.isSameCurrency(family_dto.currency, users);
        accountValidator.isTypeOf([AccountTypes.Individual], users);
        accountValidator.isActive(users);
        
        next();
    };

    removeFamilyMembers: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        const input_tup : amountTransfer= req.body.list_of_individuals;
        const family_dto : IFamilyAccountDto= familyService.getFamilyById(Number(req.params.sourceId));
        validator.isEmpty(input_tup);
        input_tup.every((id, amount)=> validator.isNumeric(id) && validator.isPositive(amount));
        family_dto.owners.every(owner=> {
            if(input_tup.some(id=> id === owner.individual_id)) {
                return true;
            }
            throw new BadRequest(`at least one of the input id wasn't belong to a family members`);
        })

        next();
    };

    closeFamilyAccount: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        validator.required(req.params, ["id"]);
        validator.isNumeric(req.params.id);

        next();
    };

    
}

const familyValidator = new FamilyValidator();

export default familyValidator;
