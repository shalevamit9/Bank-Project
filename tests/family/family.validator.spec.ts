/* eslint-disable @typescript-eslint/await-thenable */
import { Request, Response } from "express";
import { expect } from "chai";
import sinon from "sinon";
import familyValidator from "../../src/modules/family/family.validator";
import {
    ICreateFamily,
    IFamilyAccountDto,
} from "../../src/modules/family/family.interface.js";
import { IIndividualAccount } from "../../src/modules/individual/individual.interface.js";
import { AccountTypes } from "../../src/modules/account/account.interface.js";
import individualRepository from "../../src/modules/individual/individual.repository.js";
import businessRepository from "../../src/modules/business/business.repository.js";
import validator from "../../src/utils/validator.js";
import accountValidator from "../../src/utils/account.validation.utils.js";
import * as validation_utils from "../../src/utils/validation.utils.js";
import family_service from "../../src/modules/family/family.service.js";
const validationResultHandler = { ...validation_utils };

describe("Family Validator Functions:", () => {
    before(() => {
        sinon.restore();
    });
    afterEach(() => {
        sinon.restore();
    });

    const create_valid_account1: ICreateFamily = {
        currency: "USD",
        context: "travel",
        owners: [[3, 3000]],
    };

    const owners: IIndividualAccount[] = [
        {
            account_id: 30,
            balance: 7000,
            individual_account_id: 2,
            currency: "ILS",
            status: 1,
            type: AccountTypes.Individual,
            individual_id: 12345,
            first_name: "amit",
            last_name: "shalev",
            email: "amit@gmail.com",
            address_id: 1,
            city: "Alderetes",
            country_code: "AR",
            country_name: "147",
            postal_code: 4178,
            region: "Jeziora Wielkie",
            street_name: "Jana",
            street_number: 7,
        },
        {
            account_id: 31,
            balance: 24000,
            individual_account_id: 3,
            currency: "ILS",
            status: 1,
            type: AccountTypes.Individual,
            individual_id: 12645,
            first_name: "gideon",
            last_name: "shachar",
            email: "gidi@gmail.com",
            address_id: 1,
            city: "Alderetes",
            country_code: "AR",
            country_name: "147",
            postal_code: 4178,
            region: "Jeziora Wielkie",
            street_name: "Jana",
            street_number: 7,
        },
    ];

    const full_family: IFamilyAccountDto = {
        family_account_id: 23,
        context: "vacation",
        account_id: 32,
        currency: "ILS",
        balance: 5000,
        status: 1,
        type: AccountTypes.Family,
        owners: [
            {
                account_id: 30,
                balance: 7000,
                individual_account_id: 2,
                currency: "ILS",
                status: 1,
                type: AccountTypes.Individual,
                individual_id: 12345,
                first_name: "amit",
                last_name: "shalev",
                email: "amit@gmail.com",
                address: {
                    address_id: 1,
                    city: "Alderetes",
                    country_code: "AR",
                    country_name: "147",
                    postal_code: 4178,
                    region: "Jeziora Wielkie",
                    street_name: "Jana",
                    street_number: 7,
                },
            },
            {
                account_id: 31,
                balance: 24000,
                individual_account_id: 3,
                currency: "ILS",
                status: 1,
                type: AccountTypes.Individual,
                individual_id: 12645,
                first_name: "gideon",
                last_name: "shachar",
                email: "gidi@gmail.com",
                address: {
                    address_id: 1,
                    city: "Alderetes",
                    country_code: "AR",
                    country_name: "147",
                    postal_code: 4178,
                    region: "Jeziora Wielkie",
                    street_name: "Jana",
                    street_number: 7,
                },
            },
        ],
    };

    context("#createFamily()", () => {
        it("should be a function", () => {
            expect(familyValidator.createFamily).to.be.a("function");
        });

        it("create family validation middleware", async () => {
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "notExist").returns(true);

            const owner = owners[0];
            sinon
                .stub(individualRepository, "getIndividualById")
                .resolves(owner);

            sinon.stub(validator, "isExist").returns(true);
            sinon.stub(accountValidator, "isActive").returns(true);
            sinon.stub(accountValidator, "isTypeOf").returns(true);
            sinon.stub(accountValidator, "isSameCurrency").returns(true);
            sinon.stub(validator, "hasMinSum").returns(true);
            sinon.stub(validator, "isGreaterThan").returns(true);

            sinon.stub(validator, "hasMinimalRemainingBalance").returns(true);
            sinon
                .stub(validationResultHandler, "validationResultsHandler")
                .callsFake(() => 1);

            const req = {} as Request;
            req.body = create_valid_account1;
            const res = {} as Response;
            const next = () => 1;
            const next_spy = sinon.spy(next);

            await familyValidator.createFamily(req, res, next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("#getFamily()", () => {
        it("should be a function", () => {
            expect(familyValidator.getFamily).to.be.a("function");
        });

        it("get family validation middleware", () => {
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon
                .stub(validationResultHandler, "validationResultsHandler")
                .callsFake(() => 1);

            const req = {} as Request;
            req.params = { id: "1" };
            const res = {} as Response;
            const next = () => 1;
            const next_spy = sinon.spy(next);

            familyValidator.getFamily(req, res, next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("#addFamilyMembers()", () => {
        it("should be a function", () => {
            expect(familyValidator.addFamilyMembers).to.be.a("function");
        });

        it("add family members validation middleware", async () => {
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isPositive").returns(true);
            sinon.stub(family_service, "getFamilyById").resolves(full_family);
            sinon.stub(accountValidator, "isSameCurrency").returns(true);
            sinon.stub(accountValidator, "isTypeOf").returns(true);
            sinon.stub(accountValidator, "isActive").returns(true);
            sinon
                .stub(validationResultHandler, "validationResultsHandler")
                .callsFake(() => 1);

            const tT = [1, 5000];
            const tTArray = [tT];
            const req = {} as Request;
            req.params = { id: "1" };
            req.body = { individual_accounts: tTArray };
            const res = {} as Response;
            const next = () => 1;
            const next_spy = sinon.spy(next);

            await familyValidator.addFamilyMembers(req, res, next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("validate removeFamilyMembers", () => {
        it("should be a function", () => {
            expect(familyValidator.removeFamilyMembers).to.be.a("function");
        });

        it("remove from members from family validation middleware", () => {
            sinon.stub(family_service, "getFamilyById").resolves(full_family);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isPositive").returns(true);
            sinon
                .stub(validationResultHandler, "validationResultsHandler")
                .callsFake(() => 1);

            const req = {} as Request;
            req.params = { id: "1" };
            const res = {} as Response;
            const next = () => 1;
            const next_spy = sinon.spy(next);

            familyValidator.closeFamilyAccount(req, res, next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("validate closeFamilyAccount", () => {
        it("should be a function", () => {
            expect(familyValidator.closeFamilyAccount).to.be.a("function");
        });

        it("close family validation middleware", () => {
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon
                .stub(validationResultHandler, "validationResultsHandler")
                .callsFake(() => 1);

            const req = {} as Request;
            req.params = { id: "1" };
            const res = {} as Response;
            const next = () => 1;
            const next_spy = sinon.spy(next);

            familyValidator.closeFamilyAccount(req, res, next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("validate transferToBusiness", () => {
        const business_account = {
            business_account_id: 1,
            company_id: 20334011,
            account_id: 1,
            company_name: "nespresso",
            currency: "nis",
            balance: 6000,
            type: AccountTypes.Individual,
            context: "vication",
            status: 1,
            address_id: 1,
            country_name: "Israel",
            country_code: "IL",
            postal_code: 6606,
            city: "Tel Aviv",
            region: "Center",
            street_name: "Menachem Begin",
            street_number: 45,
        };

        it("should be a function", () => {
            expect(familyValidator.transferToBusiness).to.be.a("function");
        });

        it("transfer to business validation middleware", async () => {
            sinon.stub(family_service, "getFamilyById").resolves(full_family);
            sinon
                .stub(businessRepository, "getBusinessById")
                .resolves(business_account);
            sinon.stub(validator, "isExist").returns(true);
            sinon.stub(accountValidator, "isActive").returns(true);
            sinon.stub(accountValidator, "isTypeOf").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isPositive").returns(true);
            sinon.stub(accountValidator, "isSameCurrency").returns(true);
            sinon.stub(validator, "hasMinimalRemainingBalance").returns(true);
            sinon.stub(validator, "isLessThan").returns(true);
            sinon
                .stub(validationResultHandler, "validationResultsHandler")
                .callsFake(() => 1);

            const req = {} as Request;
            req.params = { source_id: "1", destination_id: "2" };
            req.body = { amount: 1 };
            const res = {} as Response;
            const next = () => 1;
            const next_spy = sinon.spy(next);

            await familyValidator.transferToBusiness(req, res, next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });
});
