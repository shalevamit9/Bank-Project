import { Request, Response, RequestHandler, NextFunction } from "express";
import validator from "../../utils/validator.js";
import familyService from "./family.service.js";
import { IFamilyAccountDto } from "./family.interface.js";
import { IIndividualAccountDto } from "../individual/individual.interface.js";
import accountValidator from "../../utils/account.validator.js";
import {
    AccountTypes,
    BalanceTransfer,
    IAccount,
} from "../../types/accounts.interface.js";
import { TransferTuple } from "../../types/accounts.interface.js";
import { ICreateFamily } from "./family.interface.js";
import businessRepository from "../business/business.repository.js";
import { IBusinessAccount } from "../business/business.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import { IValidationResult } from "../../types/validation.interface.js";
import individualRepository from "../individual/individual.repository.js";
import config from "../../config/config.js";

class FamilyValidator {
    family_minimum_allowed_balance: number =
        config.FAMILY_MINIMUM_ALLOWED_BALANCE;

    createFamily: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const results: IValidationResult[] = [];
        const family_dto: ICreateFamily = req.body;

        results.push({
            is_valid: validator.required(family_dto, ["owners", "currency"]),
            message: "owners or currency property is missing",
        });
        results.push({
            is_valid: validator.notExist(family_dto, ["family_account_id"]),
            message:
                "the family_account_id property should not be passed as input",
        });

        const pending_accounts = family_dto.owners.map(
            async (owner) =>
                await individualRepository.getIndividualById(Number(owner[0]))
        );

        const accounts = await Promise.all(pending_accounts);
        results.push({
            // DOESN'T WORK!! PROBABLY FAILS IN THE "getIndividualById" 3 LINES ABOVE
            is_valid: validator.isExist(accounts, family_dto.owners.length),
            message: "one or more of the individual accounts doesn't exist",
        });
        results.push({
            is_valid: accountValidator.isActive(accounts),
            message: "one or more of the individual accounts is not active",
        });
        results.push({
            is_valid: accountValidator.isTypeOf(
                [AccountTypes.Individual],
                accounts
            ),
            message: "at least one of the accounts is not of type individual",
        });
        results.push({
            is_valid: accountValidator.isSameCurrency(
                family_dto.currency,
                accounts
            ),
            message:
                "at least one of the individual accounts doesn't have the same currency as the family",
        });
        results.push({
            is_valid: validator.hasMinSum(
                this.family_minimum_allowed_balance,
                family_dto.owners.map((owner) => owner[1])
            ),
            message:
                "the transfered amount is not enough to open a family account",
        });
        const balance_tuples: BalanceTransfer[] = accounts.map((account, i) => [
            account.balance,
            family_dto.owners[i][1],
        ]);
        validator.hasMinimalRemainingBalance(1000, balance_tuples);

        next();
    };

    getFamily: RequestHandler = (req, res, next) => {
        const results: IValidationResult[] = [];
        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: `id property is missing`,
        });
        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: `the provided id should be numeric`,
        });

        validationResultsHandler(results);

        next();
    };

    addFamilyMembers: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];
        const accounts_tuples: TransferTuple[] = req.body.individual_accounts;
        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: "id property is missing",
        });

        results.push({
            is_valid: validator.isEmpty(accounts_tuples),
            message: "individual accounts list is empty",
        });
        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: "the provided id should be numeric",
        });
        results.push({
            is_valid: accounts_tuples.every((account) =>
                validator.isNumeric(account[0])
            ),
            message: "the provided accounts IDs should be numeric",
        });
        results.push({
            is_valid: accounts_tuples.every((account) =>
                validator.isPositive(account[1])
            ),
            message:
                "all amounts to be transferred from individual accounts should be positive",
        });

        const family_dto = await familyService.getFamilyById(
            Number(req.params.id)
        );

        const accounts = family_dto.owners as IIndividualAccountDto[]; // .map((owner) => owner);

        results.push({
            is_valid: accountValidator.isSameCurrency(
                family_dto.currency,
                accounts
            ),
            message:
                "at least one of the individual accounts doesn't have the same currency as the family",
        });
        results.push({
            is_valid: accountValidator.isTypeOf(
                [AccountTypes.Individual],
                accounts
            ),
            message: "at least one of the accounts is not of type individual",
        });
        results.push({
            is_valid: accountValidator.isActive(accounts),
            message: "at least one of the users is not active",
        });

        validationResultsHandler(results); // CRASHES HERE, ERROR: LIST IS EMPTY

        next();
    };

    removeFamilyMembers: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];
        const accounts_tuples: TransferTuple[] = req.body.individual_accounts;
        const family_dto = await familyService.getFamilyById(
            Number(req.params.id)
        );
        console.log("Tuples in valiator: ", accounts_tuples);
        console.log("Tuples[].length = ", accounts_tuples.length);
        console.log("is empty? ", validator.isEmpty(accounts_tuples));

        const owners = family_dto.owners as IIndividualAccountDto[];

        results.push({
            is_valid: validator.isEmpty(accounts_tuples),
            message: `individual accounts list should not be empty`,
        });

        results.push({
            is_valid: accounts_tuples.every(
                (account) =>
                    validator.isNumeric(account[0]) && // id
                    validator.isNumeric(account[1]) && // amount
                    validator.isPositive(account[1])
            ),
            message: `accounts IDs and amounts should be numeric and positive`,
        });
        results.push({
            is_valid: validator.hasMinimalRemainingBalance(
                this.family_minimum_allowed_balance,
                [[Number(family_dto.balance), Number(req.body.amount)]]
            ),
            message: "family is not allow to transfer this amount",
        });
        results.push({
            is_valid: accounts_tuples.every((account) => {
                return owners.some(
                    (owner) => owner.individual_account_id === account[0]
                );
            }),
            message: `all individual accounts must be assigned to the family`,
        });
        results.push({
            is_valid: validator.isLessThan(
                this.family_minimum_allowed_balance,
                Number(req.body.amount)
            ),
            message:
                "the maximum amount that family can transfer at once is 5,000",
        });

        validationResultsHandler(results);

        next();
    };

    closeFamilyAccount: RequestHandler = (req, res, next) => {
        const results: IValidationResult[] = [];

        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: `id property is missing`,
        });

        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: `id property should be numeric`,
        });

        validationResultsHandler(results);

        next();
    };

    transferToBusiness: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];
        const family_dto = await familyService.getFamilyById(
            Number(req.params.source_id)
        );

        const owners = family_dto.owners as IIndividualAccountDto[]; // .map((owner) => owner);

        results.push({
            is_valid: validator.isExist(owners as IAccount[], owners.length),
            message: "",
        });

        // SHOULD ALSO CHECK IF SOURCE AND DESTINATION EXIST

        results.push({
            is_valid: accountValidator.isActive(owners),
            message: "all family owners accounts should be active",
        });

        // SHOULD ALSO CHECK IF SOURCE AND DESTINATION ARE ACTIVE

        results.push({
            is_valid: accountValidator.isTypeOf(
                [AccountTypes.Family],
                [family_dto]
            ),
            message: "the source account should be a family account",
        });
        results.push({
            is_valid: accountValidator.isTypeOf(
                [AccountTypes.Individual],
                owners
            ),
            message:
                "at least one user in the list of users is not of type individual",
        });

        const destination_account = await businessRepository.getBusinessById(
            Number(req.params.destination_id)
        );
        results.push({
            is_valid: accountValidator.isTypeOf(
                [AccountTypes.Business],
                [destination_account]
            ),
            message: "the destination account should be a business account",
        });

        const { amount } = req.body;

        results.push({
            is_valid: validator.isNumeric(amount),
            message: "the transfer amount should be numeric",
        });
        results.push({
            is_valid: validator.isPositive(Number(amount)),
            message: "the transfer amount should be positive",
        });
        results.push({
            is_valid: accountValidator.isSameCurrency(family_dto.currency, [
                destination_account,
            ]),
            message:
                "the business account and family account don't have the same currency",
        });
        results.push({
            is_valid: input_tup.every(
                (id, amount) =>
                    validator.isNumeric(id) &&
                    validator.isNumeric(amount) &&
                    validator.isPositive(amount)
            ),
            message: `at least one of the amount in the tuple is not numeric or a positive amount`,
        });
        results.push({
            is_valid: input_tup.every((transfer) => {
                return owners.some(
                    (owner) => owner.individual_account_id === transfer[0]
                );
            }),
            message: `at least one of the id in the tuple is not matching a user`,
        });
        results.push({
            // define constant
            is_valid: validator.hasMinimalRemainingBalance(5000, [
                [Number(family_dto.balance), Number(amount)],
            ]),
            message:
                "the family account is not allowed to transfer this amount",
        });
        results.push({
            // define constant
            is_valid: validator.isLessThan(5000, Number(amount)),
            message: `the maximal amount a family account can transfer at once is 5,000 ${family_dto.currency}`, // define constant
        });

        validationResultsHandler(results);

        next();
    };
}

const familyValidator = new FamilyValidator();

export default familyValidator;
