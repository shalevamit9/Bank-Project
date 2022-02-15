/* eslint-disable @typescript-eslint/await-thenable */
import { Request, Response } from "express";
import { expect } from "chai";
import sinon from "sinon";
import { IIndividualAccount } from "../../src/modules/individual/individual.interface.js";
import { IBusinessAccount } from "../../src/modules/business/business.interface.js";
import { AccountTypes } from "../../src/modules/account/account.interface.js";
import individualRepository from "../../src/modules/individual/individual.repository.js";
import businessRepository from "../../src/modules/business/business.repository.js";
import validator from "../../src/utils/validator.js";
import accountValidator from "../../src/utils/account.validator.js";
import * as validation_utils from "../../src/utils/validation.utils.js";
import businessValidator from "../../src/modules/business/business.validator.js";
const validationResultHandler = {...validation_utils};



describe("Business Validator Functions:", () => {

    before(() => {sinon.restore()});
    afterEach(() => {sinon.restore()});

    const business_account_source : IBusinessAccount= {
        "business_account_id": 1,
        "company_id": 20334011,
        "account_id": 1,
        "company_name": "nespresso",
        "currency": "nis",
        "balance": 6000,
        "type": AccountTypes.Individual,
        "context":"vication",
        "status": 1,
        "address_id": 1,
        "country_name": "Israel",
        "country_code": "IL",
        "postal_code": 6606,
        "city": "Tel Aviv",
        "region": "Center",
        "street_name": "Menachem Begin",
        "street_number": 45
    };

    const individual_account : IIndividualAccount = {
        "individual_account_id": 1,
        "individual_id": 2033401,
        "account_id": 1,
        "currency": "nis",
        "balance": 6000,
        "type": AccountTypes.Individual,
        "status": 1,
        "first_name": "avi",
        "last_name": "ron",
        "email": "avi@ron.com",
        "address_id": 1,
        "country_name": "Israel",
        "country_code": "IL",
        "postal_code": 6606,
        "city": "Tel Aviv",
        "region": "Center",
        "street_name": "Menachem Begin",
        "street_number": 45
    };

    context("#createBusiness()", () => {
  
        it("should be a function", () => {
            expect(businessValidator.createBusiness).to.be.a("function");
        });

        it("create business validation middleware test", async () => {
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isGreaterThan").returns(true);
            sinon.stub(validator, "isValidLength").returns(true);
            sinon.stub(validationResultHandler, "validationResultsHandler").callsFake(() => 1);

            const req  = {} as Request;
            req.body = business_account_source;
            const res  = {} as Response;
            const next = ()=>1;
            const next_spy = sinon.spy(next)

            await businessValidator.createBusiness(req,res,next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("#getBusiness()", () => {
  
        it("should be a function", () => {
            expect(businessValidator.createBusiness).to.be.a("function");
        });

        it("get business validation middleware test", async () => {
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validationResultHandler, "validationResultsHandler").callsFake(() => 1);

            const req  = {} as Request;
            req.params = {id:"1"};
            const res  = {} as Response;
            const next = ()=>1;
            const next_spy = sinon.spy(next)

            await businessValidator.getBusiness(req,res,next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("#transferToBusiness()", () => {
  
        it("should be a function", () => {
            expect(businessValidator.createBusiness).to.be.a("function");
        });

        it("transfer to business validation middleware test", async () => {
            sinon.stub(businessRepository, "getBusinessById").resolves(business_account_source);
            sinon.stub(validator, "isExist").returns(true);
            sinon.stub(accountValidator, "isActive").returns(true);
            sinon.stub(accountValidator, "isTypeOf").returns(true);
            sinon.stub(accountValidator, "isSameCurrency").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isPositive").returns(true);
            sinon.stub(validator, "hasMinimalRemainingBalance").returns(true);
            sinon.stub(validationResultHandler, "validationResultsHandler").callsFake(() => 1);

            const req  = {} as Request;
            req.params = {source_:"1",destination_id:"2"};
            req.body = {amount:"2000"};
            const res  = {} as Response;
            const next = ()=>1;
            const next_spy = sinon.spy(next)

            await businessValidator.transferToBusiness(req,res,next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("#transferToIndividual()", () => {
  
        it("should be a function", () => {
            expect(businessValidator.createBusiness).to.be.a("function");
        });

        it("transfer to individual validation middleware test", async () => {
            sinon.stub(businessRepository, "getBusinessById").resolves(business_account_source);
            sinon.stub(individualRepository, "getIndividualById").resolves(individual_account);
            sinon.stub(validator, "isExist").returns(true);
            sinon.stub(accountValidator, "isActive").returns(true);
            sinon.stub(accountValidator, "isTypeOf").returns(true);
            sinon.stub(accountValidator, "isSameCurrency").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isPositive").returns(true);
            sinon.stub(validator, "hasMinimalRemainingBalance").returns(true);
            sinon.stub(validationResultHandler, "validationResultsHandler").callsFake(() => 1);

            const req  = {} as Request;
            req.params = {source_:"1",destination_id:"2"};
            req.body = {amount:"2000"};
            const res  = {} as Response;
            const next = ()=>1;
            const next_spy = sinon.spy(next)

            await businessValidator.transferToIndividual(req,res,next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("#FXTransferToBusiness()", () => {
  
        it("should be a function", () => {
            expect(businessValidator.createBusiness).to.be.a("function");
        });

        it("FX transfer to business validation middleware test", async () => {
            sinon.stub(businessRepository, "getBusinessById").resolves(business_account_source);
            sinon.stub(validator, "isExist").returns(true);
            sinon.stub(accountValidator, "isActive").returns(true);
            sinon.stub(accountValidator, "isTypeOf").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isPositive").returns(true);
            sinon.stub(validator, "hasMinimalRemainingBalance").returns(true);
            sinon.stub(validationResultHandler, "validationResultsHandler").callsFake(() => 1);

            const req  = {} as Request;
            req.params = {source_:"1",destination_id:"2"};
            req.body = {amount:"2000"};
            const res  = {} as Response;
            const next = ()=>1;
            const next_spy = sinon.spy(next)

            await businessValidator.FXTransferToBusiness(req,res,next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

});

