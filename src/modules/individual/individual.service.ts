/* eslint-disable class-methods-use-this */
import individualRepository from "./individual.repository.js";
import {
    ICreateIndividualDto,
    IIndividualAccountDto,
    IIndividualAccount,
} from "./individual.interface.js";
import { IAccountFormatter } from "../../types/formatter.interface.js";
import { IAddress } from "../../types/accounts.interface.js";
import addressService from "../address/address.service.js";
import accountService from "../account/account.service.js";
import { AccountTypes } from "../../types/accounts.interface.js";

class IndividualService
    implements IAccountFormatter<IIndividualAccount, IIndividualAccountDto>
{
    getIndividualById = async (individual_account_id: number) => {
        const individual: IIndividualAccount =
            await individualRepository.getIndividualById(individual_account_id);
        if (!individual) return null;

        return this.formatAccount(individual);
    };

    getIndividuals = async (individual_ids: number[]) => {
        const individuals = await individualRepository.getIndividuals(
            individual_ids
        );
        if (!individuals) return null;

        return individuals.map((individual) => this.formatAccount(individual));
    };

    // createIndividual = async (payload: ICreateIndividualDto) => {
    //     const individual = await individualRepository.createIndividualAccount(payload);
    //     return individual;
    // };

    createIndividualAccount = async (
        create_individual_dto: ICreateIndividualDto
    ) => {
        let address: IAddress | undefined;
        if (create_individual_dto.address) {
            address = await addressService.createAddress(
                create_individual_dto.address
            );
        }

        const { balance, currency } = create_individual_dto;
        const account = await accountService.createAccount({
            balance,
            currency,
            type: AccountTypes.Individual,
        });

        //     individual_account_id: number;
        // individual_id: number;
        // first_name: string;
        // last_name: string;
        // email: string;

        create_individual_dto.address = address;
        const { individual_id, first_name, last_name, email } =
            create_individual_dto;
        const individual = await individualRepository.createIndividualAccount({
            individual_id,
            first_name,
            last_name,
            email,
            address_id: address?.address_id,
            account_id: account.account_id,
        });

        const individual_dto: IIndividualAccountDto = { ...individual };
        if (address) individual_dto.address = address;

        return individual_dto;
    };

    formatAccount(individual: IIndividualAccount) {
        const individual_dto: IIndividualAccountDto = {
            account_id: individual.account_id,
            balance: individual.balance,
            individual_account_id: individual.individual_account_id,
            currency: individual.currency,
            status: individual.status,
            type: individual.type,
            individual_id: individual.individual_id,
            first_name: individual.first_name,
            last_name: individual.last_name,
            email: individual.email,
            address: {
                address_id: individual.address_id,
                city: individual.city,
                country_code: individual.country_code,
                country_name: individual.country_name,
                postal_code: individual.postal_code,
                region: individual.region,
                street_name: individual.street_name,
                street_number: individual.street_number,
            },
        };

        return individual_dto;
    }
}

const individualService = new IndividualService();

export default individualService;
