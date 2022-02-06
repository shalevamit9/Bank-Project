/* eslint-disable class-methods-use-this */
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import { IFamilyAccount, ICreateFamily } from "./family.interface.js";

class FamilyRepository {
    async getFamilyById(primary_id: number) {
        const [accounts] = (await db.query(
            "SELECT * FROM family_accounts WHERE id = ?",
            primary_id
        )) as RowDataPacket[][];

        return accounts[0] as IFamilyAccount;
    }

    async createFamilyAccount(family_data: ICreateFamily) {
        const [result] = (await db.query(
            "INSERT INTO family_accounts SET ?",
            family_data
        )) as ResultSetHeader[];
        const family = await this.getFamilyById(result.insertId);

        return family;
    }

    async transferFamilyToBusiness(
        source_id: number,
        destination_id: number,
        amount: number
    ) {
        throw new Error("Method not implemented.");
    }
    // is it enough to get only the IDs ?
    async isInFamily(family_id: number, individual_account_ids: number[]) {
        const family = await this.getFamilyById(family_id);

        const owners_ids = family.owners.map((owner) => owner.account_id);

        for (const individual_account_id of individual_account_ids) {
            if (!owners_ids.includes(individual_account_id)) {
                return false;
                // throw new Error(`account ${individual_account_id} doesn't belong to this family account`);
            }
        }

        return true;
    }
}

const familyRepository = new FamilyRepository();

export default familyRepository;
