/* eslint-disable @typescript-eslint/unbound-method */
import { expect } from "chai";
import sinon from "sinon";
import {
    AccountTypes,
    IAccount,
} from "../../src/modules/account/account.interface.js";
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

describe("Family Service Functions:", () => {
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

    context("#createFamilyAccount()", () => {
        afterEach(() => {
            sinon.restore();
        });

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

        it("should create a family object", async () => {
            sinon.stub(accountService, "createAccount").resolves(account_obj);
            sinon.stub(familyRepository, "createFamilyAccount").resolves(24);
            sinon.stub(familyService, "addFamilyMembers").resolves(family_obj);
            expect(
                await familyService.createFamilyAccount(create_valid_account1)
            ).to.deep.equal(family_obj);
        });
    });

    context("#getFamilyById()", () => {
        afterEach(() => {
            sinon.restore();
        });

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

        const formatted_owners: IIndividualAccountDto[] = [
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
        ];

        it("should return the family details", async () => {
            sinon
                .stub(familyRepository, "getShortFamilyDetails")
                .resolves(short_family);

            sinon
                .stub(familyRepository, "getFullFamilyDetails")
                .resolves(owners);

            const format_account_callback = sinon.stub(
                individualService,
                "formatAccount"
            );

            format_account_callback.onFirstCall().returns(formatted_owners[0]);
            format_account_callback.onSecondCall().returns(formatted_owners[1]);

            expect(await familyService.getFamilyById(23)).to.deep.equal(
                full_family
            );
        });

        it("should throw if account with such id doesn't exist", async () => {
            sinon
                .stub(familyRepository, "getShortFamilyDetails")
                .resolves(undefined);

            try {
                await familyService.getFamilyById(23);
            } catch (error) {
                expect((error as Error).message).to.equal(
                    "Bad Request - Account doesn't exist"
                );
            }
        });
    });

    context("#addFamilyMembers()", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("should be called with the correct arguments", async () => {
            const add_members_stub = sinon.stub(
                familyRepository,
                "addMembersToFamily"
            );
            sinon.stub(familyService, "getFamilyById").resolves(full_family);
            await familyService.addFamilyMembers(23, [
                [1, 1000],
                [2, 1000],
            ]);
            sinon.assert.calledWith(
                add_members_stub,
                23,
                [
                    [1, 1000],
                    [2, 1000],
                ],
                2000
            );
        });
    });

    context("#removeFamilyMembers()", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("should be called with the correct arguments", async () => {
            const remove_members_stub = sinon.stub(
                familyRepository,
                "removeMembersFromFamily"
            );
            sinon.stub(familyService, "getFamilyById").resolves(full_family);
            await familyService.removeFamilyMembers(23, [
                [1, 1000],
                [2, 1000],
            ]);
            sinon.assert.calledWith(remove_members_stub, 23, [
                [1, 1000],
                [2, 1000],
            ]);
        });
    });

    context("#closeFamilyAccount()", () => {
        afterEach(() => {
            sinon.restore();
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

        it("should throw an error when there are still owners left in the family", async () => {
            sinon
                .stub(familyService, "getFamilyById")
                .resolves(invalid_owners_family);

            try {
                await familyService.closeFamilyAccount(23);
            } catch (err) {
                expect((err as Error).message).to.equal(
                    "Bad Request - can't close family account because there are still owners left"
                );
            }
        });

        it("should throw an error when the family account status is already 'inactive'", async () => {
            sinon
                .stub(familyService, "getFamilyById")
                .resolves(invalid_status_family);

            try {
                await familyService.closeFamilyAccount(23);
            } catch (err) {
                expect((err as Error).message).to.equal(
                    "Bad Request - account is already closed"
                );
            }
        });

        it("should change the family status to 'inactive'", async () => {
            sinon.stub(familyService, "getFamilyById").resolves(valid_family);
            sinon.stub(familyRepository, "closeFamilyAccount").resolves(true);

            expect(await familyService.closeFamilyAccount(23)).to.be.true;
        });
    });

    context("#transferToBusiness()", () => {
        afterEach(() => {
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

        it("should throw an error when maximal transfer amount limit is exceeded", async () => {
            sinon
                .stub(familyRepository, "getFamilyById")
                .resolves(source_account);
            sinon
                .stub(businessRepository, "getBusinessById")
                .resolves(destination_account);

            try {
                await familyService.transferToBusiness(22, 4, 6500);
            } catch (error) {
                expect((error as Error).message).to.equal(
                    "Bad Request - Cannot perform transfer - Invalid amount"
                );
            }
        });

        it("should return the updated accounts details after the transfer", async () => {
            sinon
                .stub(familyRepository, "getFamilyById")
                .resolves(source_account);
            sinon
                .stub(businessRepository, "getBusinessById")
                .resolves(destination_account);

            sinon.stub(accountRepository, "transfer").resolves(true);

            const family_transfer = await familyService.transferToBusiness(
                22,
                4,
                2000
            );
            expect(family_transfer).to.deep.equal(transfer_response);
        });
    });
});
