import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { ICreateFamily, IFamilyAccount } from "./family.interface.js";
import familyRepository from "./family.repository.js";

class FamilyService {
    createFamilyAccount(
        family_data: ICreateFamily
    ):
        | import("./family.interface").IFamilyAccount
        | PromiseLike<import("./family.interface").IFamilyAccount> {
        throw new Error("Method not implemented." + family_data.toString());
    }

    async getFamilyDetails(family_id: number, details_level: string) {
        let family;
        if (details_level.toLowerCase() === "short") {
            family = await familyRepository.getShortFamilyDetails(family_id);
        }

        family = await familyRepository.getFullFamilyDetails(family_id);

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
