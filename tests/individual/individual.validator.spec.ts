import { expect } from "chai";
import sinon from "sinon";
import individualValidator from "../../src/modules/individual/individual.validator.js";
import { IIndividualAccountDto } from "../../src/modules/individual/individual.interface.js";
import { AccountTypes } from "../../src/modules/account/account.interface.js";
import validator from "../../src/utils/validator.js";
import { Request,Response } from "express";
import * as validation_utils from "../../src/utils/validation.utils.js";
const validationResultHandler = {...validation_utils};


describe("individual service file", () => {
    before(() => {sinon.restore()});
    afterEach(() => {sinon.restore()});
    
    const individual_dto : IIndividualAccountDto = {
        "individual_account_id": 1,
        "individual_id": 2033401,
        "account_id": 1,
        "first_name": "avi",
        "last_name": "ron",
        "email": "avi@ron.com",
        "currency": "nis",
        "balance": 6000,
        "status": 1,
        "type": AccountTypes.Individual,
        "address": {
            "address_id": 1,
            "country_name": "Israel",
            "country_code": "IL",
            "postal_code": 6606,
            "city": "Tel Aviv",
            "region": "Center",
            "street_name": "Menachem Begin",
            "street_number": 45
        },
    };

    
    context("#createIndividual()", () => {
        it("should be a function", () => {
            expect(individualValidator.createIndividual).to.be.a("function");
        });

        it("this function should validate creation of IIndividualAccountDto inputs", () => {
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "notExist").returns(true);
            sinon.stub(validator, "isValidLength").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validator, "isGreaterThan").returns(true);
            sinon.stub(validationResultHandler, "validationResultsHandler").callsFake(() => 1);

            const req  = {
                body: individual_dto
            } as Request;
            const res  = {} as Response;
            const next = ()=>1;
            const next_spy = sinon.spy(next);

            individualValidator.createIndividual(req,res,next_spy); 
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

    context("#getIndividual()", () => {
        it("should be a function", () => {
            expect(individualValidator.getIndividual).to.be.a("function");
        });

        it("this function should validate get IIndividualAccountDto inputs", () => {            
            sinon.stub(validator, "required").returns(true);
            sinon.stub(validator, "isNumeric").returns(true);
            sinon.stub(validationResultHandler, "validationResultsHandler").callsFake(() => 1);
            
            const req  = {} as Request;
            req.params = {id:"1"};
            const res  = {} as Response;
            const next = ()=>1;
            const next_spy = sinon.spy(next)

            individualValidator.getIndividual(req,res,next_spy);
            expect(next_spy.calledOnce).to.be.equal(true);
        });
    });

});
