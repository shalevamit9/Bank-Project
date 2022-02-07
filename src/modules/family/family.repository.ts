/* eslint-disable class-methods-use-this */
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import addressRepository from "../address/address.repository.js";
import { IIndividualAccount } from "../individual/individual.interface.js";
import {
    IFamilyAccount,
    ICreateFamily,
    IFamilyAccountDB,
} from "./family.interface.js";

// ADAPTER - the repository returns the RowDataPacket, the adapter parses it to the correct model (our interfaces) and the service gets the data from the adapter

class FamilyRepository {
    async getFamilyById(family_id: number) {
        const get_family = `SELECT * 
            FROM family_accounts 
            INNER JOIN accounts 
            ON family_accounts.account_id = accounts.account_id 
            WHERE family_account_id = ${family_id};`;

        const [family] = (await db.query(get_family)) as RowDataPacket[][];

        return family[0] as IFamilyAccountDB;
    }

    async getFamilyOwnersIds(family_id: number) {
        const getFamilyOwners = `SELECT family_individuals.individual_account_id 
             FROM family_accounts INNER JOIN family_individuals 
             ON family_accounts.family_account_id = family_individuals.family_account_id 
             WHERE family_accounts.family_account_id = ${family_id};`;

        const [owners] = (await db.query(getFamilyOwners)) as RowDataPacket[][];

        return owners[0] as number[];
    }

    async getShortFamilyDetails(family_id: number): Promise<IFamilyAccount> {
        const family = await this.getFamilyById(family_id);
        family["owners"] = await this.getFamilyOwnersIds(family_id);

        return family as IFamilyAccount;
    }

    async getFullFamilyDetails(family_id: number): Promise<IFamilyAccount> {
        const family = await this.getShortFamilyDetails(family_id);
        const get_individual_accounts = `SELECT *
        FROM individual_accounts 
        INNER JOIN accounts ON individual_accounts.account_id = accounts.account_id
        INNER JOIN addresses ON individual_accounts.address_id = addresses.address_id
        WHERE individual_account_id IN (?);`;

        const [individual_accounts] = (await db.query(
            get_individual_accounts,
            family.owners?.toString()
        )) as RowDataPacket[][]; // ????? array.toString ?????

        const addresses_ids: number[] = individual_accounts.map(
            (account) => account.address_id
        );

        const owners_accounts = individual_accounts.map(async (account, i) => {
            account.address = await addressRepository.getAddressById(
                addresses_ids[i]
            );
            delete account.address_id;
            return account as IIndividualAccount;
        });

        family.owners = await Promise.all(owners_accounts);
        return family;
    }

    async createFamilyAccount(family_data: ICreateFamily) {
        const [result] = (await db.query(
            "INSERT INTO family_accounts SET ?;",
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

    async isInFamily(family_id: number, individual_account_ids: number[]) {
        // const family = await this.getFamilyById(family_id);
        const getFamilyOwners = `SELECT family_individuals.individual_account_id 
             FROM family_accounts INNER JOIN family_individuals 
             ON family_accounts.family_account_id = family_individuals.family_account_id 
             WHERE family_accounts.family_account_id = ${family_id};`;

        const [result] = (await db.query(getFamilyOwners)) as RowDataPacket[];

        const owners_ids = result[0] as number[];

        // const owners_ids = family.owners.map((owner) => owner.account_id);

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
