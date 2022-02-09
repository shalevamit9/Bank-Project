import {
    AccountStatuses,
    AccountTypes,
    TransferTuple,
    IAccount,
} from "../../types/accounts.interface.js";
import {
    IIndividualAccount,
    IIndividualAccountDto,
} from "../individual/individual.interface.js";
import individualService from "../individual/individual.service.js";
import { ICreateFamily } from "./family.interface.js";
import familyRepository from "./family.repository.js";

class FamilyService {
    // implements IAccountFormatter<IFamilyAccount, IFamilyAccountDto>
    async createFamilyAccount(family_data: ICreateFamily) {
        const { currency } = family_data;

        const account_data: Omit<IAccount, "account_id"> = {
            currency,
            balance: 0,
            status: AccountStatuses.Active,
            type: AccountTypes.Family,
        };

        const new_family_id = await familyRepository.createFamilyAccount(
            family_data,
            account_data
        );

        const family = await this.addFamilyMembers(
            new_family_id,
            family_data.owners,
            "full"
        );

        return family;
    }

    async getFamilyById(family_id: number, details_level = "full") {
        let family;

        family = await familyRepository.getShortFamilyDetails(family_id);

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
        details_level: string
    ) {
        const amounts_arr = accounts_to_add.map((account) => account[1]);

        const amount_to_add = amounts_arr.reduce(
            (amount, total_amount) => amount + total_amount
        );

        await familyRepository.addMembersToFamily(
            family_id,
            accounts_to_add,
            amount_to_add
        );

        let family;

        family = await this.getFamilyById(
            family_id,
            details_level.toLowerCase()
        );

        return family;
    }

    async removeFamilyMembers(
        family_id: number,
        accounts_to_remove: TransferTuple[],
        details_level: string
    ) {
        const amounts_arr = accounts_to_remove.map((account) => account[1]);

        const amount_to_remove = amounts_arr.reduce(
            (amount, total_amount) => amount + total_amount
        );

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
        await familyRepository.closeFamilyAccount(family_id);
    }

    // transferToBusiness(
    //     source_id: number,
    //     destination_id: number,
    //     transfer_data: any
    // ) {
    //     throw new Error(
    //         "Method not implemented." +
    //             source_id.toString() +
    //             destination_id.toString() +
    //             transfer_data
    //     );
    //     /*
    //      * the amount to transfer is reduced from the balance of the family account!
    //      * (each family member puts money in the family account when he joins)
    //      */

    //     /**
    //      *
    //      * UPDATE account SET balance = CASE WHEN account_id = 1 THEN 1000
    //                         WHEN account_id = 2 THEN 2000
    //                         END
    //                         WHERE account_id = 1 OR account_id = 2;
    //         11:57
    //         עבור ביצוע ההעברה בין חשבונות בשאילתא אחת.
    //      */
    // }

    // formatAccount(family: IFamilyAccount): IFamilyAccountDto {
    //     const family_dto: IFamilyAccountDto = {
    //         account_id: family.account_id,
    //         currency: family.currency,
    //         balance: family.balance,
    //         type: family.type, // "Individual" | "Business" | "Family";
    //         status: family.status, // 0 | 1;
    //         family_account_id: family.family_account_id,
    //         context: family.context, // (travel / morgage / emergency / savings / checking) --> free text
    //         owners: {}, // ???
    //     };

    //     return family_dto;
    // }
}

const family_service = new FamilyService();

export default family_service;
