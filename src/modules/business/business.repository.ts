import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import { IIndividualAccount } from "../individual/individual.interface.js";
import {
    IBusinessAccount,
    ICreateBusinessAccount,
} from "./business.interface.js";

class BusinessRepository {
    async getBusinessById(business_account_id: number) {
        const [accounts] = (await db.query(
            `SELECT * 
            FROM business_accounts ba
            JOIN accounts a ON ba.account_id = a.account_id
            LEFT JOIN addresses ad on ba.address_id = ad.address_id
            WHERE business_account_id = ?`,
            business_account_id
        )) as RowDataPacket[][];

        return accounts[0] as IBusinessAccount;
    }

    async getBusinesses(business_ids: number[]) {
        const questionMarks = Array(business_ids.length).fill("?").join(",");
        const [accounts] = (await db.query(
            `SELECT * 
            FROM business_accounts ba
            JOIN accounts a ON ba.account_id = a.account_id
            WHERE business_account_id IN (${questionMarks})`,
            business_ids
        )) as RowDataPacket[][];

        return accounts as IBusinessAccount[];
    }

    async createBusinessAccount(create_business: ICreateBusinessAccount) {
        const [result] = (await db.query(
            "INSERT INTO business_accounts SET ?",
            create_business
        )) as ResultSetHeader[];
        const business = await this.getBusinessById(result.insertId);

        return business;
    }

    async transferToBusiness(
        source_account: IBusinessAccount,
        destination_account: IBusinessAccount,
        amount: number
    ) {
        source_account.balance -= amount;
        destination_account.balance += amount;

        const [withdraw_result] = (await db.query(
            "UPDATE accounts SET balance = ? WHERE account_id = ?",
            [source_account.balance, source_account.account_id]
        )) as ResultSetHeader[];
        if (!withdraw_result.affectedRows) return false;

        const [deposit_result] = (await db.query(
            "UPDATE accounts SET balance = ? WHERE account_id = ?",
            [destination_account.balance, destination_account.account_id]
        )) as ResultSetHeader[];

        return !!deposit_result.affectedRows;
    }

    async transferToIndividual(
        source_business_account: IBusinessAccount,
        destination_individual_account: IIndividualAccount,
        amount: number
    ) {
        source_business_account.balance -= amount;
        destination_individual_account.balance += amount;

        const [withdraw_result] = (await db.query(
            "UPDATE accounts SET balance = ? WHERE account_id = ?",
            [
                source_business_account.balance,
                source_business_account.account_id,
            ]
        )) as ResultSetHeader[];
        if (!withdraw_result.affectedRows) return false;

        const [deposit_result] = (await db.query(
            "UPDATE accounts SET balance = ? WHERE account_id = ?",
            [
                destination_individual_account.balance,
                destination_individual_account.account_id,
            ]
        )) as ResultSetHeader[];
        if (!deposit_result.affectedRows) return false;

        return !!deposit_result.affectedRows;
    }
}

const artistRepository = new BusinessRepository();

export default artistRepository;
