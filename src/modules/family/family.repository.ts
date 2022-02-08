/* eslint-disable class-methods-use-this */
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import {
    AccountStatuses,
    AccountTypes,
    amountTransfer,
} from "../../types/accounts.interface.js";
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
        const get_family_owners = `SELECT family_individuals.individual_account_id 
             FROM family_accounts INNER JOIN family_individuals 
             ON family_accounts.family_account_id = family_individuals.family_account_id 
             WHERE family_accounts.family_account_id = ?;`;

        const [owners] = (await db.query(get_family_owners, family_id)) as RowDataPacket[][];
        type IndividualId = Pick<IIndividualAccount, "individual_account_id">; // maybe export to another module
        const owners_ids = owners.map(owner => (owner as IndividualId).individual_account_id);

        // console.log("fam repo getFamilyOwnersIds: family id = ", family_id);
        // console.log("owners_ids: ", owners_ids);
        return owners_ids;
    }

    async getShortFamilyDetails(family_id: number): Promise<IFamilyAccount> {
        const family = await this.getFamilyById(family_id);
        family["owners"] = await this.getFamilyOwnersIds(family_id);

        console.log("fam repo getShortFamilyDetails: family id = ", family_id);
        console.log("short family = ", family);
        return family as IFamilyAccount;
    }

    async getFullFamilyDetails(family_id: number): Promise<IFamilyAccount> {
        const family = await this.getShortFamilyDetails(family_id);
        const owners_ids_placeholder = Array(family.owners?.length)
            .fill("?")
            .join(",");

        const get_individual_accounts = `SELECT *
        FROM individual_accounts 
        INNER JOIN accounts ON individual_accounts.account_id = accounts.account_id
        LEFT JOIN addresses ON individual_accounts.address_id = addresses.address_id
        WHERE individual_account_id IN (${owners_ids_placeholder});`;

        // console.log("question string: ", owners_ids_placeholder);
        // console.log("get_indi_query = ", get_individual_accounts);

        const [individual_accounts] = (await db.query(
            get_individual_accounts,
            family.owners
        )) as RowDataPacket[][];

        // console.log("individual_accounts: ", individual_accounts);
        const addresses_ids: number[] = individual_accounts.map(
            (account) => account.address_id
        );

        // console.log("addresses_ids: ", addresses_ids);


        const owners_accounts = individual_accounts.map(async (account, i) => {
            account.address = await addressRepository.getAddressById(
                addresses_ids[i]
            );
            delete account.address_id;
            return account as IIndividualAccount;
        });

        // console.log("fam repo getfulldetails before filling: family = ", family);
        // console.log("owners_accounts: ", owners_accounts);
        family.owners = await Promise.all(owners_accounts);

        // console.log("fam repo getfulldetails AFTER filling: family = ", family);


        return family;
    }

    async addMembersToFamily(
        family_id: number,
        accounts_to_add: amountTransfer[]
    ) {
        if (accounts_to_add && accounts_to_add.length > 0) {
            const add_member = `INSERT INTO family_individuals(family_account_id, individual_account_id) VALUES (?, ?);`;

            for (const account of accounts_to_add) {
                await db.query(add_member, [family_id, account[0]]);
                // await db.query(update_family_balance, [account[1], family_id]);
            }

            const amount_to_add = accounts_to_add
                .map((account) => account[1]) // create an array of amounts
                .reduce((amount, total_balance) => amount + total_balance);

            const update_family_balance = `UPDATE accounts
            INNER JOIN family_accounts ON family_accounts.account_id = accounts.account_id
            SET accounts.balance = accounts.balance + ?
            WHERE family_accounts.family_account_id = ?`; // ?????? balance = balance + amount --> works ???

            /**  TO DO: REMOVE THE AMOUNTS FROM THE INDIVIDUAL ACCOUNTS !!! */

            await db.query(update_family_balance, [amount_to_add, family_id]);
        }
    }

    async createFamilyAccount(
        family_data: ICreateFamily
        // owning_accounts: FamilyMemberContribution[]
    ) {
        const { currency, context } = family_data;

        const account_data = {
            currency,
            balance: 0,
            status: AccountStatuses.Active,
            type: AccountTypes.Family,
        };

        const [new_account] = (await db.query(
            "INSERT INTO accounts SET ?;",
            account_data
        )) as ResultSetHeader[];

        const family_account_data = {
            context,
            account_id: new_account.insertId, // ????
        };

        console.log("account_data: ", account_data);
        console.log("family_account_data: ", family_account_data);

        const [new_family_account] = (await db.query(
            "INSERT INTO family_accounts SET ?;",
            family_account_data
        )) as ResultSetHeader[];

        const family = await this.getFamilyById(new_family_account.insertId);

        await this.addMembersToFamily(
            family.family_account_id as number,
            family_data.owners
        );

        return family;
    }

    // async isInFamily(family_id: number, individual_account_ids: number[]) {
    //     // const family = await this.getFamilyById(family_id);
    //     const getFamilyOwners = `SELECT family_individuals.individual_account_id
    //          FROM family_accounts INNER JOIN family_individuals
    //          ON family_accounts.family_account_id = family_individuals.family_account_id
    //          WHERE family_accounts.family_account_id = ${family_id};`;

    //     const [result] = (await db.query(getFamilyOwners)) as RowDataPacket[][]; // RowDataPacket[][] ??

    //     const owners_ids = result as number[]; // result[0] ??

    //     // const owners_ids = family.owners.map((owner) => owner.account_id);

    //     for (const individual_account_id of individual_account_ids) {
    //         if (!owners_ids.includes(individual_account_id)) {
    //             return false;
    //             // throw new Error(`account ${individual_account_id} doesn't belong to this family account`);
    //         }
    //     }

    //     return individual_account_ids.every((id) => owners_ids.includes(id));

    //     return true;
    // }

    addIndividualsToFamily = async (individuals_id : number[], family_id : number) => {
        let query = `INSERT INTO family_individuals (individual_account_id,family_account_id) VALUES `;
        const valuesStr = '(?,?),';
        individuals_id.forEach(()=> query += valuesStr);
        query.substring(0,query.length-1);
        await db.query(query, individuals_id.map(id=> [id,family_id]));
        const family = await this.getFamily(family_id);
        return family;
    };

    removeIndividualsFromFamily = async (individuals_id : number[], family_id : number) => {
        let query = `DELETE FROM family_individuals WHERE `;
        const valueStr = `individual_account_id = ? and family_account_id = ? OR`;
        individuals_id.forEach(()=> query += valueStr);
        query.substring(0,query.length-3);
        await db.query(query, individuals_id.map(id=> [id,family_id]));
        const family = await this.getFamily(family_id);
        return family;
    };
}

const familyRepository = new FamilyRepository();

export default familyRepository;
