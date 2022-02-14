import { expect } from "chai";
import sinon from "sinon";
import accountService from "../../src/modules/account/account.service.js";
import addressService from "../../src/modules/address/address.service.js";
import { ICreateIndividualDto, IIndividualAccount, IIndividualAccountDto } from "../../src/modules/individual/individual.interface.js";
import individualRepository from "../../src/modules/individual/individual.repository.js";
import individualService from "../../src/modules/individual/individual.service";
import { AccountTypes, IAccount } from "../../src/modules/account/account.interface.js";
import { IAddress } from "../../src/modules/address/address.interface.js";



describe("individual service file", () => {

    const address : IAddress = {
        "address_id": 1,
        "country_name": "Israel",
        "country_code": "IL",
        "postal_code": 6606,
        "city": "Tel Aviv",
        "region": "Center",
        "street_name": "Menachem Begin",
        "street_number": 45
    }; 
    
    const account : IAccount = {
        "account_id": 2033401,
        "currency": "nis",
        "balance": 6000,
        "type": AccountTypes.Individual,
        "status": 1,
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

    const create_individual_dto : ICreateIndividualDto = {
        "individual_id": 2033401,
        "currency": "nis",
        "balance": 6000,
        "status": 1,
        "type": AccountTypes.Individual,
        "first_name": "avi",
        "last_name": "ron",
        "email": "avi@ron.com",
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

    context("createindividualAccount", () => {
        it("should be a function", () => {
            expect(individualService.createIndividualAccount).to.be.a("function");
        });

        it("this function should create IIndividualAccountDto", async () => {
            sinon.stub(addressService, "createAddress").resolves(address);
            sinon.stub(accountService, "createAccount").resolves(account);
            sinon.stub(individualRepository, "createIndividualAccount").resolves(individual_account);

            const created_account = await individualService.createIndividualAccount(create_individual_dto);
            expect(created_account).to.deep.equal(individual_dto);
        });
    });

    context("getindividualById", () => {
        it("should be a function", () => {
            expect(individualService.getIndividualById).to.be.a("function");
        });

        it("this function should get the IIndividualAccountDto", async () => {
            sinon.stub(individualRepository, "getIndividualById").resolves(individual_account);

            const individual_acount = await individualService.getIndividualById(1);
            expect(individual_acount).to.deep.equals(individual_dto);
        });
    });

    context("getindividuals", () => {
        it("should be a function", () => {
            expect(individualService.getIndividuals).to.be.a("function");
        });

        it("this function should get all the IIndividualAccountDto accounts", async () => {
            sinon.stub(individualRepository, "getIndividuals").resolves([individual_account]);

            const individual_acounts = await individualService.getIndividuals([1]);
            expect(individual_acounts).to.deep.equals([individual_dto]);
        });
    });

    context("formatAccount", () => {
        it("should be a function", () => {
            expect(individualService.formatAccount).to.be.a("function");
        });

        it("this function should return IIndividualAccountDto", () => {
            const individual = individualService.formatAccount(individual_account);
            expect(individual).to.deep.equal(individual_dto);
        });
    });

});
