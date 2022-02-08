// import { BadRequest } from "../../exceptions/badRequest.exception.js";
// import { FamilyMemberContribution } from "../../types/accounts.interface.js";
// import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { ICreateFamily } from "./family.interface.js";
import familyRepository from "./family.repository.js";

class FamilyService {
    async createFamilyAccount(
        family_data: ICreateFamily
        // owning_accounts: FamilyMemberContribution[]
    ) {
        // const owning_accounts_ids = owning_accounts.map((account_contribution) => account_contribution[0]);
        const new_family = await familyRepository.createFamilyAccount(
            family_data
        ); // , owning_accounts); // , owning_accounts_ids);

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
        console.log("service: ", details_level);
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

    addFamilyMembers(id: number, individual_account_ids: number[]) {
        throw new Error(
            "Method not implemented." +
                id.toString() +
                individual_account_ids.toString()
        );
    }

    removeFamilyMembers(id: number, individual_account_ids: number[]) {
        throw new Error(
            "Method not implemented." +
                id.toString() +
                individual_account_ids.toString()
        );
    }

    closeAccount(id: number) {
        throw new Error("Method not implemented." + id.toString());
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
    }
}

const family_service = new FamilyService();

export default family_service;
