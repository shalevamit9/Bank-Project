
import { expect } from "chai";
import sinon from "sinon";
import { ICreateAccount } from "../../src/modules/account/account.interface.js";
import accountRepository from "../../src/modules/account/account.repository.js";
import accountService, {
    ITransaction,
} from "../../src/modules/account/account.service.js";
import businessRepository from "../../src/modules/business/business.repository.js";
import {
    ICreateFamily,
    IFamilyAccountDto,
} from "../../src/modules/family/family.interface.js";
import familyRepository from "../../src/modules/family/family.repository.js";
import familyService from "../../src/modules/family/family.service";
import {
    IIndividualAccount,
    IIndividualAccountDto,
} from "../../src/modules/individual/individual.interface.js";
import individualService from "../../src/modules/individual/individual.service.js";
import { AccountTypes, IAccount } from "../../src/types/accounts.interface.js";

describe("Family Service Functions:", () => {
    // REDUNDANT!! this functio implements no logic. only calls other functions!
    context("#createFamilyAccount()", () => {
        const create_valid_account1: ICreateFamily = {
            currency: "USD",
            context: "travel",
            owners: [
                [3, 3000],
                [5, 4000],
            ],
        };

        const family_obj: IFamilyAccountDto = {
            family_account_id: 24,
            context: "travel",
            account_id: 34,
            currency: "USD",
            balance: 7000,
            status: 1,
            type: AccountTypes.Family,
            owners: [5, 3],
        };

        const account_obj: IAccount = {
            account_id: 34,
            currency: "USD",
            balance: 7000,
            status: 1,
            type: AccountTypes.Family,
        };

        const create_account_stub = sinon.stub(accountService, "createAccount");
        const create_family_account_stub = sinon.stub(
            familyRepository,
            "createFamilyAccount"
        );
        const add_family_members_stub = sinon.stub(
            familyService,
            "addFamilyMembers"
        );

        // REDUNDANT!! this functio implements no logic. only calls other functions!
        it("should create a family object", async () => {
            create_account_stub.resolves(account_obj);
            create_family_account_stub.resolves(24);
            add_family_members_stub.resolves(family_obj);
            expect(
                await familyService.createFamilyAccount(create_valid_account1)
            ).to.deep.equal(family_obj);
        });
    });

    context("#getFamilyById()", () => {
        const short_family: IFamilyAccountDto = {
            family_account_id: 23,
            context: "vacation",
            account_id: 32,
            currency: "ILS",
            balance: 5000,
            status: 1,
            type: AccountTypes.Family,
            owners: [2, 3],
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

        const get_short_stub = sinon.stub(
            familyRepository,
            "getShortFamilyDetails"
        );
        const get_full_stub = sinon.stub(
            familyRepository,
            "getFullFamilyDetails"
        );
        const format_account_callback = sinon.spy(
            individualService,
            "formatAccount"
        );

        it("should be a function", () => {
            expect(familyService.getFamilyById).to.be.a("function");
        });

        it("should return the family details", async () => {
            console.log("format_account_callback: ", format_account_callback);
            console.log(
                "callback.firstCall: ",
                format_account_callback.firstCall
            );
            console.log(
                "callback.secondCall.args[0]: ",
                format_account_callback.secondCall
            );

            get_short_stub.resolves(short_family);
            get_full_stub.resolves(owners);

            expect(await familyService.getFamilyById(23)).to.deep.equal(
                full_family
            );

            expect(format_account_callback.firstCall.args[0]).to.equal(
                owners[0]
            );
            expect(format_account_callback.secondCall.args[0]).to.equal(
                owners[1]
            );

            console.log("format_account_callback: ", format_account_callback);
            console.log(
                "callback.firstCall: ",
                format_account_callback.firstCall
            );
            console.log(
                "callback.secondCall.args[0]: ",
                format_account_callback.secondCall
            );
        });
    });

    context("addFamilyMembers", () => {
        it("should be a function", () => {
            expect(familyService.addFamilyMembers).to.be.a("function");
        });
    });

    context("removeFamilyMembers", () => {
        it("should be a function", () => {
            expect(familyService.removeFamilyMembers).to.be.a("function");
        });
    });

    context("#closeFamilyAccount()", () => {
        // DONE
        after(() => {
            sinon.restore();
            //     get_by_id_stub.restore();
            //     close_account_stub.restore();
        });

        const valid_family: IFamilyAccountDto = {
            family_account_id: 23,
            context: "vacation",
            account_id: 32,
            currency: "ILS",
            balance: 5000,
            status: 1,
            type: AccountTypes.Family,
            owners: [],
        };

        const invalid_owners_family: IFamilyAccountDto = {
            family_account_id: 23,
            context: "vacation",
            account_id: 32,
            currency: "ILS",
            balance: 5000,
            status: 1,
            type: AccountTypes.Family,
            owners: [9, 8, 7],
        };

        const invalid_status_family: IFamilyAccountDto = {
            family_account_id: 23,
            context: "vacation",
            account_id: 32,
            currency: "ILS",
            balance: 5000,
            status: 0,
            type: AccountTypes.Family,
            owners: [],
        };

        const get_by_id_stub = sinon.stub(familyService, "getFamilyById");

        const close_account_stub = sinon.stub(
            familyRepository,
            "closeFamilyAccount"
        );

        it("should throw an error when there are still owners left in the family", async () => {
            get_by_id_stub.resolves(invalid_owners_family);

            try {
                await familyService.closeFamilyAccount(23);
            } catch (err: any) {
                expect(err.message).to.equal(
                    "Bad Request - can't close family account because there are still owners left"
                );
            }
        });

        it("should throw an error when the family account status is already 'inactive'", async () => {
            get_by_id_stub.resolves(invalid_status_family);

            try {
                await familyService.closeFamilyAccount(23);
            } catch (err: any) {
                expect(err.message).to.equal(
                    "Bad Request - account is already closed"
                );
            }
        });

        it("should change the family status to 'inactive'", async () => {
            get_by_id_stub.resolves(valid_family);
            close_account_stub.resolves(true);

            expect(await familyService.closeFamilyAccount(23)).to.be.true;
        });
    });

    context("#transferToBusiness()", () => {
        after(() => {
            sinon.restore();
        });

        const source_account = {
            family_account_id: 22,
            context: "morgage",
            account_id: 29,
            currency: "ILS",
            balance: 55000,
            status: 1,
            type: AccountTypes.Family,
        };

        const destination_account = {
            business_account_id: 4,
            company_id: 10123758,
            company_name: "Microsoft",
            context: "Microsoft",
            account_id: 36,
            currency: "ILS",
            balance: 700000,
            status: 1,
            type: AccountTypes.Business,
            address_id: 1,
            city: "Alderetes",
            country_code: "AR",
            country_name: "147",
            postal_code: 4178,
            region: "Jeziora Wielkie",
            street_name: "Jana",
            street_number: 7,
        };

        const transfer_response: ITransaction = {
            source_account: {
                account_id: 29,
                balance: 53000,
                currency: "ILS",
            },
            destination_account: {
                account_id: 36,
                balance: 702000,
                currency: "ILS",
            },
        };

        const get_family_stub = sinon.stub(familyRepository, "getFamilyById");
        const get_business_stub = sinon.stub(
            businessRepository,
            "getBusinessById"
        );
        const account_repo_transfer_stub = sinon
            .stub(accountRepository, "transfer");
            // .resolves(true);
        const transfer_spy = sinon.spy(accountService, "transfer");

        it("should throw an error when maximal transfer amount limit is exceeded", async () => {
            // expect(await familyService.transferToBusiness(x, y, z)).to.deep.equal("Bad Request - Cannot perform transfer - Invalid amount");
        });

        it("should return the updated accounts details after the transfer", async () => {
            get_family_stub.resolves(source_account);
            get_business_stub.resolves(destination_account);
            account_repo_transfer_stub.resolves(true);
            expect(
                await familyService.transferToBusiness(22, 4, 2000)
            ).to.deep.equal(transfer_response);
        });
    });
});
