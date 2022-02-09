import { IAddress } from "../../types/accounts.interface.js";
import accountService from "../account/account.service.js";
import addressService from "../address/address.service.js";
import {
    IBusinessAccount,
    IBusinessAccountDto,
    ICreateBusinessDto,
} from "./business.interface.js";
import businessRepository from "./business.repository.js";
import { AccountTypes } from "../../types/accounts.interface.js";
import { IAccountFormatter } from "../../types/formatter.interface.js";
import individualRepository from "../individual/individual.repository.js";

class BusinessService
    implements IAccountFormatter<IBusinessAccount, IBusinessAccountDto>
{
    async getBusinessAccountById(business_account_id: number) {
        const business = await businessRepository.getBusinessById(
            business_account_id
        );
        if (!business) return null;

        const business_dto = this.formatAccount(business);

        return business_dto;
    }

    async getBusinesses(business_account_ids: number[]) {
        const businesses = await businessRepository.getBusinesses(
            business_account_ids
        );
        if (businesses.length === 0) return null;
        console.log(businesses);

        return businesses.map((business) => this.formatAccount(business));
    }

    async createBusinessAccount(create_business_dto: ICreateBusinessDto) {
        let address: IAddress | undefined;
        if (create_business_dto.address) {
            address = await addressService.createAddress(
                create_business_dto.address
            );
        }

        const { balance, currency } = create_business_dto;
        const account = await accountService.createAccount({
            balance,
            currency,
            type: AccountTypes.Business,
        });

        create_business_dto.address = address;
        const { company_id, company_name, context } = create_business_dto;
        const business = await businessRepository.createBusinessAccount({
            company_id,
            company_name,
            context,
            address_id: address?.address_id,
            account_id: account.account_id,
        });

        const business_dto: IBusinessAccountDto = { ...business };
        if (address) business_dto.address = address;

        return business_dto;
    }

    async transferToBusiness(
        source_id: number,
        destination_id: number,
        amount: number
    ) {
        const [source_account, destination_account] = await Promise.all([
            businessRepository.getBusinessById(source_id),
            businessRepository.getBusinessById(destination_id),
        ]);

        const isValidTransfer =
            (source_account.company_id === destination_account.company_id &&
                amount <= 10000) ||
            (source_account.company_id !== destination_account.company_id &&
                amount <= 1000);
        if (!isValidTransfer) return null;

        const isTransfered = await businessRepository.transferToBusiness(
            source_account,
            destination_account,
            amount
        );
        if (!isTransfered) return null;

        const transaction = {
            source_account: {
                business_account_id: source_account.business_account_id,
                balance: source_account.balance,
                currency: source_account.currency,
            },
            destination_account: {
                business_account_id: destination_account.business_account_id,
                balance: destination_account.balance,
                currency: destination_account.currency,
            },
        };
        return transaction;
    }

    // still need to test after finishing individual module
    async transferToIndividual(
        source_id: number,
        destination_id: number,
        amount: number
    ) {
        const [business_account, individual_account] = await Promise.all([
            businessRepository.getBusinessById(source_id),
            individualRepository.getIndividualById(destination_id),
        ]);

        const isValidTransfer = amount <= 1000;
        if (isValidTransfer) return null;

        const isTransfered = await businessRepository.transferToIndividual(
            business_account,
            individual_account,
            amount
        );
        if (!isTransfered) return null;

        const transaction = {
            source_account: {
                business_account_id: business_account.business_account_id,
                balance: business_account.balance,
                currency: business_account.currency,
            },
            destination_account: {
                business_account_id: individual_account.individual_account_id,
                balance: individual_account.balance,
                currency: individual_account.currency,
            },
        };
        return transaction;
    }

    async fxTransferToBusiness(
        source_id: number,
        destination_id: number,
        amount: number
    ) {}

    formatAccount(business: IBusinessAccount) {
        const business_dto: IBusinessAccountDto = {
            account_id: business.account_id,
            balance: business.balance,
            business_account_id: business.business_account_id,
            company_id: business.company_id,
            company_name: business.company_name,
            context: business.company_name,
            currency: business.currency,
            status: business.status,
            type: business.type,
            address: {
                address_id: business.address_id,
                city: business.city,
                country_code: business.country_code,
                country_name: business.country_name,
                postal_code: business.postal_code,
                region: business.region,
                street_name: business.street_name,
                street_number: business.street_number,
            },
        };

        return business_dto;
    }
}

const businessService = new BusinessService();

export default businessService;
