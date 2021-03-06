import config from "../../config/config.js";
import { IAddress } from "../address/address.interface.js";
import accountService from "../account/account.service.js";
import addressService from "../address/address.service.js";
import {
    IBusinessAccount,
    IBusinessAccountDto,
    ICreateBusinessDto,
} from "./business.interface.js";
import businessRepository from "./business.repository.js";
import { AccountTypes } from "../account/account.interface.js";
import { IAccountFormatter } from "../../types/formatter.interface.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import individualRepository from "../individual/individual.repository.js";
import { getRate } from "../../utils/exchange.rate.js";

const {
    BUSINESS_MAX_TRANSFER_LIMIT_SAME_COMPANY,
    BUSINESS_MAX_TRANSFER_LIMIT_OTHER_COMPANY,
    BUSINESS_MAX_TRANSFER_LIMIT_INDIVIDUAL,
} = config;

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

        const business_dto = this.formatAccount(business);
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
                amount <= BUSINESS_MAX_TRANSFER_LIMIT_SAME_COMPANY) ||
            (source_account.company_id !== destination_account.company_id &&
                amount <= BUSINESS_MAX_TRANSFER_LIMIT_OTHER_COMPANY);
        if (config.TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG && !isValidTransfer)
            throw new BadRequest("Passed Transfer Limit");

        const transaction = await accountService.transfer(
            source_account,
            destination_account,
            amount,
            amount
        );
        return transaction;
    }

    async transferToIndividual(
        source_id: number,
        destination_id: number,
        amount: number
    ) {
        const [business_account, individual_account] = await Promise.all([
            businessRepository.getBusinessById(source_id),
            individualRepository.getIndividualById(destination_id),
        ]);

        const isValidTransfer =
            amount <= BUSINESS_MAX_TRANSFER_LIMIT_INDIVIDUAL;
        if (config.TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG && !isValidTransfer)
            throw new BadRequest("Passed Transfer Limit");

        const transaction = await accountService.transfer(
            business_account,
            individual_account,
            amount,
            amount
        );
        return transaction;
    }

    async fxTransferToBusiness(
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
                amount <= BUSINESS_MAX_TRANSFER_LIMIT_SAME_COMPANY) ||
            (source_account.company_id !== destination_account.company_id &&
                amount <= BUSINESS_MAX_TRANSFER_LIMIT_OTHER_COMPANY);
        if (config.TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG && !isValidTransfer)
            throw new BadRequest("Passed Transfer Limit");

        const rate = await getRate(
            source_account.currency,
            destination_account.currency
        );

        const transaction = await accountService.transfer(
            source_account,
            destination_account,
            amount,
            amount * rate
        );
        if (transaction) transaction.fx_rate = rate;
        return transaction;
    }

    formatAccount(business: IBusinessAccount) {
        const business_dto: IBusinessAccountDto = {
            account_id: business.account_id,
            balance: business.balance,
            business_account_id: business.business_account_id,
            company_id: business.company_id,
            company_name: business.company_name,
            context: business.context,
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
