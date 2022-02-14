/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { ICreateAccount } from "../account/account.interface.js";
import accountService from "../account/account.service.js";
import businessRepository from "../business/business.repository.js";
import individualService from "../individual/individual.service.js";
import { ICreateFamily } from "./family.interface.js";
import familyRepository from "./family.repository.js";
import {
    IIndividualAccount,
    IIndividualAccountDto,
} from "../individual/individual.interface.js";
import {
    TransferTuple,
} from "../../types/accounts.interface.js";
import { AccountStatuses,
    AccountTypes, } from "../account/account.interface.js";

class FamilyService {
    async createFamilyAccount(family_data: ICreateFamily) {
        const { currency } = family_data;

        const account_data: ICreateAccount = {
            currency,
            balance: 0,
            status: AccountStatuses.Active,
            type: AccountTypes.Family,
        };

        const account = await accountService.createAccount(account_data);
        const new_family_id = await familyRepository.createFamilyAccount(
            family_data,
            account.account_id
        );

        const family = await this.addFamilyMembers(
            new_family_id,
            family_data.owners
        );

        return family;
    }

    async getFamilyById(family_id: number, details_level = "full") {
        const family = await familyRepository.getShortFamilyDetails(family_id);

        if (!family) {
            throw new BadRequest("Account doesn't exist");
        }

        if (
            details_level === "short" ||
            (family.owners as number[]).length === 0
        ) {
            return family;
        }

        let individual_accounts: IIndividualAccount[] =
            await familyRepository.getFullFamilyDetails(family_id);

        let family_owners: IIndividualAccountDto[] = individual_accounts.map(
            (account) => individualService.formatAccount(account)
        );

        family.owners = family_owners;

        return family;
    }

    async addFamilyMembers(
        family_id: number,
        accounts_to_add: TransferTuple[],
        details_level = "full"
    ) {
        const amounts_arr = accounts_to_add.map((account) => account[1]);

        //use one reduce
        const amount_to_add = amounts_arr.reduce(
            (amount, total_amount) => amount + total_amount
        );

        await familyRepository.addMembersToFamily(
            family_id,
            accounts_to_add,
            amount_to_add
        );

        const family = await this.getFamilyById(
            family_id,
            details_level.toLowerCase()
        );

        return family;
    }

    async removeFamilyMembers(
        family_id: number,
        accounts_to_remove: TransferTuple[],
        details_level = "full"
    ) {
        const amount_to_remove = accounts_to_remove
            .map((account) => account[1])
            .reduce((total_amount, amount) => amount + total_amount, 0);

        await familyRepository.removeMembersFromFamily(
            family_id,
            accounts_to_remove,
            amount_to_remove
        );

        let family;

        family = await this.getFamilyById(
            family_id,
            details_level.toLowerCase()
        );

        return family;
    }

    async closeFamilyAccount(family_id: number) {
        const family_to_close = await this.getFamilyById(family_id, "short");

        if ((family_to_close.owners as number[]).length > 0) {
            throw new BadRequest(
                "can't close family account because there are still owners left"
            );
        }

        if (family_to_close.status === AccountStatuses.Inactive) {
            throw new BadRequest("account is already closed");
        }

        const isClosed = await familyRepository.closeFamilyAccount(family_id);
        return isClosed;
    }

    async transferToBusiness(
        source_id: number,
        destination_id: number,
        transfer_amount: number
    ) {
        const source_account = await familyRepository.getFamilyById(source_id);
        const destination_account = await businessRepository.getBusinessById(
            destination_id
        );

        if (transfer_amount > 5000) {  // define constants
            throw new BadRequest("Cannot perform transfer - Invalid amount");
        }

        const transfer_result = await accountService.transfer(
            source_account,
            destination_account,
            transfer_amount,
            transfer_amount
        );

        return transfer_result;
    }
}

const family_service = new FamilyService();

export default family_service;
