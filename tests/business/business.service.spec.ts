import { expect } from "chai";
import { restore, stub } from "sinon";
import {
    IBusinessAccount,
    IBusinessAccountDto,
    ICreateBusinessDto,
} from "../../src/modules/business/business.interface.js";
import businessService from "../../src/modules/business/business.service.js";
import accountService, {
    ITransaction,
} from "../../src/modules/account/account.service.js";
import businessRepository from "../../src/modules/business/business.repository.js";
import addressService from "../../src/modules/address/address.service.js";
import individualRepository from "../../src/modules/individual/individual.repository.js";
import { IIndividualAccount } from "../../src/modules/individual/individual.interface.js";
import exchange_rate_utils from "../../src/utils/exchange.rate.js";
import { IAddress } from "../../src/modules/address/address.interface.js";
import {
    AccountStatuses,
    AccountTypes,
    IAccount,
} from "../../src/modules/account/account.interface.js";

describe("Business Service module", () => {
    const address: IAddress = {
        address_id: 1,
        city: "Bat Yam",
        country_code: "ISR",
        country_name: "Israel",
        postal_code: 123,
        region: "Region",
        street_name: "Hertzel",
        street_number: 10,
    };

    const account: IAccount = {
        account_id: 1,
        balance: 1000,
        currency: "ILS",
        status: AccountStatuses.Active,
        type: AccountTypes.Business,
    };

    const business_account: IBusinessAccount = {
        business_account_id: 1,
        company_id: 1,
        company_name: "Rapyd",
        context: "Holiday",
        ...address,
        ...account,
    };

    const second_business_account: IBusinessAccount = {
        ...business_account,
        business_account_id: 2,
        account_id: 2,
    };

    const business_dto: IBusinessAccountDto = {
        business_account_id: 1,
        ...account,
        company_id: 1,
        company_name: "Rapyd",
        context: "Holiday",
        address,
    };

    const individual_account: IIndividualAccount = {
        ...account,
        ...address,
        individual_account_id: 1,
        individual_id: 1234567,
        email: "email@mail.com",
        first_name: "Menashe",
        last_name: "Ohayon",
    };

    before(() => {
        restore();
    });

    afterEach(() => {
        restore();
    });

    context("#getBusinessAccountById()", () => {
        it("should get a business dto from flat business object", async () => {
            stub(businessRepository, "getBusinessById").resolves(
                business_account
            );
            expect(
                await businessService.getBusinessAccountById(1)
            ).to.deep.equal(business_dto);
        });
    });

    context("#createBusinessAccount()", () => {
        it("should create and return business dto", async () => {
            const create_business_dto: ICreateBusinessDto = {
                company_name: "Rapyd",
                company_id: 1,
                context: "Holiday",
                currency: "ILS",
                balance: 100,
                type: AccountTypes.Business,
                status: AccountStatuses.Active,
            };
            stub(addressService, "createAddress").resolves({} as IAddress);
            stub(accountService, "createAccount").resolves({} as IAccount);
            stub(businessRepository, "createBusinessAccount").resolves(
                business_account
            );

            const created_account = await businessService.createBusinessAccount(
                create_business_dto
            );
            expect(created_account).to.deep.equal(business_dto);
        });
    });

    context("#getBusinesses()", () => {
        it("should get array of business accounts dto", async () => {
            const mock_accounts = [business_account, second_business_account];
            stub(businessRepository, "getBusinesses").resolves(mock_accounts);

            const accounts = await businessService.getBusinesses([1, 2]);
            const second_business_dto: IBusinessAccountDto = {
                ...business_dto,
            };
            second_business_dto.business_account_id =
                second_business_account.business_account_id;
            second_business_dto.account_id = second_business_account.account_id;

            expect(accounts).to.deep.equal([business_dto, second_business_dto]);
        });
    });

    context("#transferToBusiness()", () => {
        it("should transfer from business to business", async () => {
            const get_business_stub = stub(
                businessRepository,
                "getBusinessById"
            );
            get_business_stub.onFirstCall().resolves(business_account);
            get_business_stub.onSecondCall().resolves(second_business_account);

            const transaction_dto: ITransaction = {
                source_account: {
                    account_id: 1,
                    balance: 900,
                    currency: "ILS",
                },
                destination_account: {
                    account_id: 2,
                    balance: 1100,
                    currency: "ILS",
                },
            };
            stub(accountService, "transfer").resolves(transaction_dto);

            const transaction = await businessService.transferToBusiness(
                1,
                2,
                100
            );

            expect(transaction).to.deep.equal(transaction_dto);
        });

        it("should throw with different companies and transfer amount over limit", async () => {
            const get_business_stub = stub(
                businessRepository,
                "getBusinessById"
            );
            get_business_stub.onFirstCall().resolves(business_account);
            get_business_stub.onSecondCall().resolves(second_business_account);

            try {
                await businessService.transferToBusiness(1, 2, 10001);
            } catch (err) {
                expect((err as Error).message).to.be.equal(
                    "Bad Request - Passed Transfer Limit"
                );
            }
        });

        it("should throw with same companies and transfer amount over limit", async () => {
            const get_business_stub = stub(
                businessRepository,
                "getBusinessById"
            );
            get_business_stub.onFirstCall().resolves(business_account);
            get_business_stub
                .onSecondCall()
                .resolves({ ...business_account, company_id: 2 });

            try {
                await businessService.transferToBusiness(1, 2, 1001);
            } catch (err) {
                expect((err as Error).message).to.be.equal(
                    "Bad Request - Passed Transfer Limit"
                );
            }
        });
    });

    context("#transferToIndividual()", () => {
        it("should transfer from business to individual", async () => {
            stub(businessRepository, "getBusinessById").resolves(
                business_account
            );
            stub(individualRepository, "getIndividualById").resolves(
                individual_account
            );

            const transaction_dto: ITransaction = {
                source_account: {
                    account_id: 1,
                    balance: 900,
                    currency: "ILS",
                },
                destination_account: {
                    account_id: 2,
                    balance: 1100,
                    currency: "ILS",
                },
            };
            stub(accountService, "transfer").resolves(transaction_dto);

            const transaction = await businessService.transferToIndividual(
                1,
                2,
                100
            );

            expect(transaction).to.deep.equal(transaction_dto);
        });

        it("should throw with transfer amount over limit", async () => {
            stub(businessRepository, "getBusinessById").resolves(
                business_account
            );
            stub(individualRepository, "getIndividualById").resolves(
                individual_account
            );

            try {
                await businessService.transferToIndividual(1, 2, 1001);
            } catch (err) {
                expect((err as Error).message).to.be.equal(
                    "Bad Request - Passed Transfer Limit"
                );
            }
        });
    });

    context("#fxTransferToBusiness()", () => {
        it("should transfer from business to business with foreign exchange", async () => {
            const get_business_stub = stub(
                businessRepository,
                "getBusinessById"
            );
            const first_account: IBusinessAccount = {
                ...business_account,
                currency: "EUR",
            };
            const second_account: IBusinessAccount = {
                ...second_business_account,
                currency: "GBP",
            };
            get_business_stub.onFirstCall().resolves(first_account);
            get_business_stub.onSecondCall().resolves(second_account);
            const transaction_dto: ITransaction = {
                source_account: {
                    account_id: 1,
                    balance: 900,
                    currency: "EUR",
                },
                destination_account: {
                    account_id: 2,
                    balance: 1050,
                    currency: "GBP",
                },
            };
            stub(accountService, "transfer").resolves(transaction_dto);
            stub(exchange_rate_utils, "getRate").resolves(0.5);

            const transaction = await businessService.fxTransferToBusiness(
                1,
                2,
                100
            );

            expect(transaction).to.deep.equal(transaction_dto);
        });

        it("should throw with same companies and transfer amount over limit", async () => {
            const get_business_stub = stub(
                businessRepository,
                "getBusinessById"
            );
            get_business_stub.onFirstCall().resolves(business_account);
            get_business_stub.onSecondCall().resolves(second_business_account);

            try {
                await businessService.fxTransferToBusiness(1, 2, 10001);
            } catch (err) {
                expect((err as Error).message).to.be.equal(
                    "Bad Request - Passed Transfer Limit"
                );
            }
        });

        it("should throw with different companies and transfer amount over limit", async () => {
            const get_business_stub = stub(
                businessRepository,
                "getBusinessById"
            );
            const second_account: IBusinessAccount = {
                ...second_business_account,
                company_id: 2,
            };
            get_business_stub.onFirstCall().resolves(business_account);
            get_business_stub.onSecondCall().resolves(second_account);

            try {
                await businessService.fxTransferToBusiness(1, 2, 1001);
            } catch (err) {
                expect((err as Error).message).to.be.equal(
                    "Bad Request - Passed Transfer Limit"
                );
            }
        });
    });
});
