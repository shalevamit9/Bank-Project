// import { BadRequest } from "../../exceptions/badRequest.exception.js";
// import { FamilyMemberContribution } from "../../types/accounts.interface.js";
// import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { db } from "../../db/mysql.connection.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { amountTransfer } from "../../types/accounts.interface.js";
import { ICreateFamily } from "./family.interface.js";
import familyRepository from "./family.repository.js";

class FamilyService {
    async createFamilyAccount(family_data: ICreateFamily) {
        const new_family = await familyRepository.createFamilyAccount(
            family_data
        );

        // if(!new_family) {
        //     throw new BadRequest("failed creating new family account");
        // }

        const family = await familyRepository.getFullFamilyDetails(
            new_family.family_account_id as number
        );
        return family;
    }

    async getFamilyDetails(family_id: number, details_level: string) {
        let family;

        if (details_level.toLowerCase() === "short") {
            family = await familyRepository.getShortFamilyDetails(family_id);
        } else {
            family = await familyRepository.getFullFamilyDetails(family_id);
        }

        // if(!family) {
        //     throw new BadRequest(`family with id ${family_id} doesn't exist`);
        // }

        return family;
    }

    async addFamilyMembers(
        family_id: number,
        individual_accounts: amountTransfer[],
        details_level: string
    ) {
        await familyRepository.addMembersToFamily(
            family_id,
            individual_accounts
        );

        let family;
        if (details_level.toLowerCase() === "short") {
            family = await familyRepository.getShortFamilyDetails(family_id);
        } else {
            family = await familyRepository.getFullFamilyDetails(family_id);
        }
        return family;
    }

    async removeFamilyMembers(
        family_id: number,
        individual_accounts: amountTransfer[],
        details_level: string
    ) {
        await familyRepository.removeMembersFromFamily(
            family_id,
            individual_accounts
        );

        let family;
        if (details_level.toLowerCase() === "short") {
            family = await familyRepository.getShortFamilyDetails(family_id);
        } else {
            family = await familyRepository.getFullFamilyDetails(family_id);
        }

        return family;
    }

    async closeFamilyAccount(family_id: number) {
        await familyRepository.closeFamilyAccount(family_id);
    }

    transferToBusiness(
        source_id: number,
        destination_id: number,
        transfer_data: any
    ) {
        throw new Error(
            "Method not implemented." +
                source_id.toString() +
                destination_id.toString() +
                transfer_data
        );
        /*
         * the amount to transfer is reduced from the balance of the family account!
         * (each family member puts money in the family account when he joins)
         */

        /**
         * 
         * UPDATE account SET balance = CASE WHEN account_id = 1 THEN 1000
                            WHEN account_id = 2 THEN 2000
                            END
                            WHERE account_id = 1 OR account_id = 2;
            11:57
            עבור ביצוע ההעברה בין חשבונות בשאילתא אחת.
         */
    }
}

const family_service = new FamilyService();

export default family_service;
