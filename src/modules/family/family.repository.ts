/* eslint-disable class-methods-use-this */
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import { BadRequest } from "../../exceptions/badRequest.exception.js";
import { TransferTuple, IAccount } from "../../types/accounts.interface.js";
import {
    IIndividualAccount,
    IIndividualAccountDto,
} from "../individual/individual.interface.js";
import {
    IFamilyAccountDto,
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

    async getShortFamilyDetails(family_id: number): Promise<IFamilyAccountDto> {
        const family = await this.getFamilyById(family_id);
        family["owners"] = await this.getFamilyOwnersIds(family_id);

        return family as IFamilyAccountDto;
    }

    async getFullFamilyDetails(family_id: number) {
        const family = await this.getShortFamilyDetails(family_id);

        const owners_ids_placeholder = Array(family.owners?.length)
            .fill("?")
            .join(",");

        const get_individual_accounts = `SELECT *
        FROM individual_accounts ia
        INNER JOIN accounts ac ON ia.account_id = ac.account_id
        LEFT JOIN addresses ad ON ia.address_id = ad.address_id
        WHERE ia.individual_account_id IN (${owners_ids_placeholder});`;

        const [individual_accounts] = (await db.query(
            get_individual_accounts,
            family.owners
        )) as RowDataPacket[][];

        return individual_accounts as IIndividualAccount[];
    }

    async addMembersToFamily(
        family_id: number,
        accounts_to_add: TransferTuple[],
        amount_to_add: number
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

    async createFamilyAccount(
        family_data: ICreateFamily,
        account_data: Omit<IAccount, "account_id">
    ) {
        const { context } = family_data;

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

        return new_family_account.insertId;
    }

    async removeMembersFromFamily(
        family_id: number,
        accounts_to_remove: TransferTuple[],
        amount_to_remove: number
    ) {
        // if (accounts_to_remove && accounts_to_remove.length > 0) {
        await db.beginTransaction();

        try {
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
                (result[0].owners_count as number) - accounts_to_remove.length;

            /*  
            Make sure there is a minimal amount left in the account (if there are any owners left after the removal)
            BEFORE deleting from the DB !!!
            */
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
        // }
    }

    async closeFamilyAccount(family_id: number) {
        const family_to_close = await this.getShortFamilyDetails(family_id);

        if ((family_to_close.owners as number[]).length > 0) {
            throw new BadRequest(
                "can't close family account because there are still owners left"
            );
        }

        const deactivate_account = `UPDATE accounts
            INNER JOIN family_accounts ON accounts.account_id = family_accounts.account_id
            SET accounts.status = 0
            WHERE family_accounts.family_account_id = ?`;

        await db.query(deactivate_account, family_id);
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

    //    // return individual_account_ids.every((id) => owners_ids.includes(id));

    //     return true;
    // }
}

const familyRepository = new FamilyRepository();

export default familyRepository;
