import { ICreateFamily } from "./family.interface.js";


class FamilyService {
    createFamilyAccount(family_data: ICreateFamily): import("./family.interface").IFamilyAccount | PromiseLike<import("./family.interface").IFamilyAccount> {
        throw new Error("Method not implemented." + family_data.toString());
    }

    getShortFamilyDetails(id: number) {
        throw new Error("Method not implemented." + id.toString());
    }

    getFullFamilyDetails(id: number) {
        throw new Error("Method not implemented." + id.toString());
    }

    addFamilyMembers(id: number, individual_account_ids: number[]) {
        throw new Error("Method not implemented." + id.toString() + individual_account_ids.toString());
    }

    removeFamilyMembers(id: number, individual_account_ids: number[]) {
        throw new Error("Method not implemented." + id.toString() + individual_account_ids.toString());
    }

    closeAccount(id: number) {
        throw new Error("Method not implemented." + id.toString());
    }

    transferToBusiness(source_id: number, destination_id: number, transfer_data: any) {
        throw new Error("Method not implemented." + source_id.toString() + destination_id.toString() + transfer_data);
    }

}

const family_service = new FamilyService();

export default family_service;