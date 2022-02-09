/* eslint-disable class-methods-use-this */
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import {
    AccountStatuses,
    AccountTypes,
    amountTransfer,
} from "../../types/accounts.interface.js";
import addressRepository from "../address/address.repository.js";
import { IIndividualAccountDto } from "../individual/individual.interface.js";
import {
    IFamilyAccount,
    ICreateFamily,
    IFamilyAccountDB,
} from "./family.interface.js";

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

        const [owners] = (await db.query(
            get_family_owners,
            family_id
        )) as RowDataPacket[][];
        type IndividualId = Pick<
            IIndividualAccountDto,
            "individual_account_id"
        >; // maybe export to another module
        const owners_ids = owners.map(
            (owner) => (owner as IndividualId).individual_account_id
        );

        return owners_ids;
    }

    async getShortFamilyDetails(family_id: number): Promise<IFamilyAccount> {
        const family = await this.getFamilyById(family_id);
        family["owners"] = await this.getFamilyOwnersIds(family_id);

        return family as IFamilyAccount;
    }

    async getFullFamilyDetails(family_id: number): Promise<IFamilyAccount> {
        const family = await this.getShortFamilyDetails(family_id);

        if (family.owners?.length === 0) {
            return family;
        }

        const owners_ids_placeholder = Array(family.owners?.length)
            .fill("?")
            .join(",");

        const get_individual_accounts = `SELECT *
        FROM individual_accounts 
        INNER JOIN accounts ON individual_accounts.account_id = accounts.account_id
        WHERE individual_account_id IN (${owners_ids_placeholder});`;

        const [individual_accounts] = (await db.query(
            get_individual_accounts,
            family.owners
        )) as RowDataPacket[][];

        const addresses_ids: number[] = individual_accounts.map(
            (account) => account.address_id
        );

        const owners_accounts = individual_accounts.map(async (account, i) => {
            account.address = await addressRepository.getAddressById(
                addresses_ids[i]
            );
            delete account.address_id;
            return account as IIndividualAccountDto;
        });

        family.owners = await Promise.all(owners_accounts);

        return family;
    }

    async addMembersToFamily(
        family_id: number,
        accounts_to_add: amountTransfer[]
    ) {
        if (accounts_to_add && accounts_to_add.length > 0) {
            await db.beginTransaction();
            try {
                const add_member = `INSERT INTO family_individuals(family_account_id, individual_account_id) VALUES (?, ?);`;

                const update_individuals_balance = `UPDATE accounts
                    INNER JOIN individual_accounts ON individual_accounts.account_id = accounts.account_id
                    SET accounts.balance = accounts.balance - ?
                    WHERE individual_accounts.individual_account_id = ?`;

                for (const account of accounts_to_add) {
                    await db.query(add_member, [family_id, account[0]]);
                    await db.query(update_individuals_balance, [
                        account[1],
                        account[0],
                    ]);
                }

                const amounts_arr = accounts_to_add.map(
                    (account) => account[1]
                ); // create an array of amounts

                const amount_to_add = amounts_arr.reduce(
                    (amount, total_amount) => amount + total_amount
                );

                const update_family_balance = `UPDATE accounts
                    INNER JOIN family_accounts ON family_accounts.account_id = accounts.account_id
                    SET accounts.balance = accounts.balance + ?
                    WHERE family_accounts.family_account_id = ?`;

                await db.query(update_family_balance, [
                    amount_to_add,
                    family_id,
                ]);
                await db.commit();
            } catch (err) {
                await db.rollback();
                throw err;
            }
        }
    }

    async createFamilyAccount(family_data: ICreateFamily) {
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
            account_id: new_account.insertId,
        };

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

    async removeMembersFromFamily(
        family_id: number,
        accounts_to_remove: amountTransfer[]
    ) {
        if (accounts_to_remove && accounts_to_remove.length > 0) {
            /*  
            !!!!!!
                TODO: Make sure there is a minimal amount left in the account (if there are any owners left after the removal)
                      BEFORE deleting from the DB !!!
            !!!!!!
             */

            await db.beginTransaction();

            try {
                const amounts_arr = accounts_to_remove.map(
                    (account) => account[1]
                ); // create an array of amounts

                const amount_to_remove = amounts_arr.reduce(
                    (amount, total_amount) => amount + total_amount
                );

                const get_details = `SELECT accounts.balance, COUNT(individual_account_id) AS owners_count
                    FROM family_accounts INNER JOIN accounts ON family_accounts.account_id = accounts.account_id
                    RIGHT JOIN family_individuals ON family_accounts.family_account_id = family_individuals.family_account_id
                    WHERE family_accounts.family_account_id = ?;`;

                const [result] = (await db.query(
                    get_details,
                    family_id
                )) as RowDataPacket[][];
                const current_balance = result[0].balance as number;
                const owners_left_after_removal =
                    (result[0].owners_count as number) -
                    accounts_to_remove.length;

                if (
                    owners_left_after_removal > 0 &&
                    current_balance - amount_to_remove < 5000
                ) {
                    throw new BadRequest(
                        "can't remove family members! remaining balance is invalid."
                    );
                }

                const remove_member = `DELETE FROM family_individuals WHERE family_account_id = ? AND individual_account_id = ?;`;

                const update_individuals_balance = `UPDATE accounts
                    INNER JOIN individual_accounts ON individual_accounts.account_id = accounts.account_id
                    SET accounts.balance = accounts.balance + ?
                    WHERE individual_accounts.individual_account_id = ?`;

                for (const account of accounts_to_remove) {
                    await db.query(remove_member, [family_id, account[0]]);
                    await db.query(update_individuals_balance, [
                        account[1],
                        account[0],
                    ]);
                }

                const update_family_balance = `UPDATE accounts
                    INNER JOIN family_accounts ON family_accounts.account_id = accounts.account_id
                    SET accounts.balance = accounts.balance - ?
                    WHERE family_accounts.family_account_id = ?`;

                await db.query(update_family_balance, [
                    amount_to_remove,
                    family_id,
                ]);

                await db.commit();
            } catch (err) {
                await db.rollback();
                throw err;
            }
        }
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

    // ===========================================================
    //      GIDI's Functions - START
    // ===========================================================

    //#region
    // addIndividualsToFamily = async (individuals_id : number[], family_id : number) => {
    //     let query = `INSERT INTO family_individuals (individual_account_id,family_account_id) VALUES `;
    //     const valuesStr = '(?,?),';
    //     individuals_id.forEach(()=> query += valuesStr);
    //     query.substring(0,query.length-1);
    //     await db.query(query, individuals_id.map(id=> [id,family_id]));
    //     const family = await this.getFamily(family_id);
    //     return family;
    // };

    // removeIndividualsFromFamily = async (individuals_id : number[], family_id : number) => {
    //     let query = `DELETE FROM family_individuals WHERE `;
    //     const valueStr = `individual_account_id = ? and family_account_id = ? OR`;
    //     individuals_id.forEach(()=> query += valueStr);
    //     query.substring(0,query.length-3);
    //     await db.query(query, individuals_id.map(id=> [id,family_id]));
    //     const family = await this.getFamily(family_id);
    //     return family;
    // };

    //#endregion
    // ===========================================================
    //      GIDI's Functions - END
    // ===========================================================
}

const familyRepository = new FamilyRepository();

export default familyRepository;
