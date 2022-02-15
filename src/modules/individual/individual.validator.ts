import { Request, Response, RequestHandler, NextFunction } from "express";
import validator from "../../utils/validator.js";
import { IIndividualAccountDto } from "./individual.interface.js";
import { validationResultsHandler } from "../../utils/validation.utils.js";
import { IValidationResult } from "../../types/validation.interface.js";
import config from "../../config/config.js";
import individualService from "./individual.service.js";
import { AccountTypes, IAccount } from "../../types/accounts.interface.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import accountValidatorUtil from "../../utils/account.validation.utils.js";
import familyService from "../family/family.service.js";

const { INDIVIDUAL_MINIMUM_ALLOWED_BALANCE } = config;
class IndividualValidator {
    createIndividual: RequestHandler = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const results: IValidationResult[] = [];
        const individual_dto: IIndividualAccountDto = req.body;
        const mandatory_keys = [
            "individual_id",
            "first_name",
            "last_name",
            "currency",
        ];

        results.push({
            is_valid: validator.required(individual_dto, mandatory_keys),
            message: `At least one of the following properties are missing [${mandatory_keys.toString()}]`,
        });
        results.push({
            is_valid: validator.notExist(individual_dto, [
                "individual_account_id",
            ]),
            message: "individual_account_id can't be exist",
        });
        results.push({
            is_valid: validator.isValidLength(
                7,
                String(individual_dto.individual_id)
            ),
            message: "individual_id length is not 7",
        });
        results.push({
            is_valid: validator.isNumeric(individual_dto.individual_id),
            message: "individual_id is not numeric",
        });
        results.push({
            is_valid: validator.isGreaterThan(
                1000000,
                Number(individual_dto.individual_id)
            ),
            message: "individual_id is not greater than 1000000",
        });

        validationResultsHandler(results);

        next();
    };

    getIndividual: RequestHandler = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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

    transferToFamily: RequestHandler = async (req, res, next) => {
        const results: IValidationResult[] = [];

        const source_account = await individualService.getIndividualById(
            Number(req.params.source_id)
        );

        const destination_account = await familyService.getFamilyById(
            Number(req.params.destination_id)
        );

        const owners = destination_account.owners as IIndividualAccountDto[];

        const accounts = [
            source_account,
            destination_account,
        ] as IAccount[];

        if (!validator.isExist(accounts)) {
            throw new BadRequest(
                "source account or destination account doesn't exist"
            );
        }

        results.push({
            is_valid: accountValidatorUtil.isActive([
                source_account as IAccount,
                destination_account,
            ]),
            message: "at least one of the accounts is not active",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf([AccountTypes.Individual], [
                source_account,
            ] as IAccount[]),
            message: "the source account should be an individual account",
        });
        results.push({
            is_valid: accountValidatorUtil.isTypeOf(
                [AccountTypes.Family],
                [destination_account]
            ),
            message: "the destination account should be a family account",
        });
        results.push({
            is_valid: owners
                .map((account) => account.individual_account_id)
                .includes(source_account?.individual_account_id as number),
            message:
                "the individual account should belong to the family account in order to allow the transfer",
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
                source_account?.currency as string,
                [destination_account]
            ),
            message:
                "the accounts don't have the same currency",
        });
        results.push({
            is_valid: validator.hasMinimalRemainingBalance(
                INDIVIDUAL_MINIMUM_ALLOWED_BALANCE,
                [[Number(source_account?.balance), Number(amount)]]
            ),
            message:
                "the individual account is not allowed to transfer this amount",
        });

        validationResultsHandler(results);

        next();
    };
}

const individualValidator = new IndividualValidator();

export default individualValidator;
