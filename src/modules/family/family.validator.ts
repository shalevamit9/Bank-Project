import { RequestHandler } from "express";
import validator from "../../utils/validator.js";
import familyService from "./family.service.js";
import config from "../../config/config.js";
import { IIndividualAccountDto } from "../individual/individual.interface.js";
import accountValidatorUtil from "../../utils/account.validation.utils.js";
import { ICreateFamily, IUpdateMembers } from "./family.interface.js";
import businessRepository from "../business/business.repository.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import { IValidationResult } from "../../types/validation.interface.js";
import individualRepository from "../individual/individual.repository.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { BalanceTransfer } from "../../types/accounts.interface.js";
import { AccountTypes, IAccount } from "../account/account.interface.js";

const {
    FAMILY_MINIMUM_ALLOWED_BALANCE,
    FAMILY_MAX_TRANSFER_LIMIT,
    INDIVIDUAL_MINIMUM_ALLOWED_BALANCE,
} = config;

class FamilyValidator {
    createFamily: RequestHandler = async (req, res, next) => {
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
        if (!validator.isExist(accounts)) {
            throw new BadRequest(
                "one or more of the individual accounts doesn't exist"
            );
        }
        results.push({
            is_valid: accountValidatorUtil.isActive(accounts),
            message: "one or more of the individual accounts is not active",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Individual],
                accounts
            ),
            message: "at least one of the accounts is not of type individual",
        });
        results.push({
            is_valid: accountValidatorUtil.isSameCurrency(
                family_dto.currency,
                accounts
            ),
            message:
                "at least one of the individual accounts doesn't have the same currency as the family",
        });
        results.push({
            is_valid: validator.hasMinSum(
                FAMILY_MINIMUM_ALLOWED_BALANCE,
                family_dto.owners.map((owner) => owner[1])
            ),
            message:
                "the transfered amount is not enough to open a family account",
        });
        const balance_tuples: BalanceTransfer[] = accounts.map((account, i) => [
            account.balance,
            family_dto.owners[i][1],
        ]);
        validator.hasMinimalRemainingBalance(
            INDIVIDUAL_MINIMUM_ALLOWED_BALANCE,
            balance_tuples
        );

        validationResultsHandler(results);
        next();
    };

    getFamily: RequestHandler = (req, res, next) => {
        const results: IValidationResult[] = [];
        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: "id property is missing",
        });
        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: "the provided id should be numeric",
        });

        validationResultsHandler(results);

        next();
    };

    addFamilyMembers: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];
        const { individual_accounts } = req.body as IUpdateMembers;

        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: "id property is missing",
        });
        results.push({
            is_valid: !validator.isEmpty(individual_accounts),
            message: "individual accounts list is empty",
        });

        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: "the provided id should be numeric",
        });
        results.push({
            is_valid: individual_accounts.every((account) =>
                validator.isNumeric(account[0])
            ),
            message: "the provided accounts IDs should be numeric",
        });
        results.push({
            is_valid: individual_accounts.every((account) =>
                validator.isPositive(account[1])
            ),
            message:
                "all amounts to be transferred from individual accounts should be positive",
        });

        const family_dto = await familyService.getFamilyById(
            Number(req.params.id)
        );
        const accounts = family_dto.owners as IIndividualAccountDto[];

        results.push({
            is_valid: accountValidatorUtil.isSameCurrency(
                family_dto.currency,
                accounts
            ),
            message:
                "at least one of the individual accounts doesn't have the same currency as the family",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Individual],
                accounts
            ),
            message: "at least one of the accounts is not of type individual",
        });
        results.push({
            is_valid: accountValidatorUtil.isActive(accounts),
            message: "at least one of the users is not active",
        });

        validationResultsHandler(results);

        next();
    };

    removeFamilyMembers: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];
        const { individual_accounts } = req.body as IUpdateMembers;

        const family_dto = await familyService.getFamilyById(
            Number(req.params.id)
        );

        const owners = family_dto.owners as IIndividualAccountDto[];

        results.push({
            is_valid: !validator.isEmpty(individual_accounts),
            message: "individual accounts list should not be empty",
        });

        results.push({
            is_valid: individual_accounts.every(
                (account) =>
                    validator.isNumeric(account[0]) && // id
                    validator.isNumeric(account[1]) && // amount
                    validator.isPositive(account[1])
            ),
            message: "accounts IDs and amounts should be numeric and positive",
        });

        results.push({
            is_valid: individual_accounts.every((account) => {
                return owners.some(
                    (owner) => owner.individual_account_id === account[0]
                );
            }),
            message: "all individual accounts must be assigned to the family",
        });

        validationResultsHandler(results);

        next();
    };

    closeFamilyAccount: RequestHandler = (req, res, next) => {
        const results: IValidationResult[] = [];

        results.push({
            is_valid: validator.required(req.params, ["id"]),
            message: "id property is missing",
        });

        results.push({
            is_valid: validator.isNumeric(req.params.id),
            message: "id property should be numeric",
        });

        validationResultsHandler(results);

        next();
    };

    transferToBusiness: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];

        const source_account = await familyService.getFamilyById(
            Number(req.params.source_id)
        );

        const owners = source_account.owners as IIndividualAccountDto[];

        const destination_account = await businessRepository.getBusinessById(
            Number(req.params.destination_id)
        );

        const accounts = [
            source_account,
            destination_account,
            owners,
        ] as IAccount[];

        if (!validator.isExist(accounts)) {
            throw new BadRequest(
                "source account or destination account doesn't exist"
            );
        }
        results.push({
            is_valid: accountValidatorUtil.isActive([
                source_account,
                destination_account,
                ...owners,
            ]),
            message: "at least one of the accounts is not active",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Family],
                [source_account]
            ),
            message: "the source account should be a family account",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Individual],
                owners
            ),
            message:
                "at least one user in the list of users is not of type individual",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
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
            is_valid: accountValidatorUtil.isSameCurrency(
                source_account.currency,
                [destination_account]
            ),
            message:
                "the business account and family account don't have the same currency",
        });
        results.push({
            is_valid: validator.hasMinimalRemainingBalance(
                FAMILY_MINIMUM_ALLOWED_BALANCE,
                [[Number(source_account.balance), Number(amount)]]
            ),
            message:
                "the family account is not allowed to transfer this amount",
        });
        results.push({
            is_valid: validator.isLessThan(
                FAMILY_MAX_TRANSFER_LIMIT,
                Number(amount)
            ),
            message: `the maximal amount a family account can transfer at once is 5,000 ${source_account.currency}`,
        });

        validationResultsHandler(results);

        next();
    };
}

const familyValidator = new FamilyValidator();

export default familyValidator;
