import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "../../db/mysql.connection.js";
import { AccountStatuses, IAccount } from "../../types/accounts.interface.js";
import { ICreateAccount } from "./account.interface.js";

class AccountRepository {
    async getAccountById(account_id: number) {
        const [accounts] = (await db.query(
            "SELECT * FROM accounts WHERE account_id = ?",
            account_id
        )) as RowDataPacket[][];

        return accounts[0] as IAccount;
    }

    async createAccount(create_account: ICreateAccount) {
        const {
            balance = 0,
            status = AccountStatuses.Active,
            type,
            currency,
        } = create_account;
        const [result] = (await db.query("INSERT INTO accounts SET ?", {
            currency,
            balance,
            status,
            type,
        })) as ResultSetHeader[];

        const account = await this.getAccountById(result.insertId);
        return account;
    }
}

const accountRepository = new AccountRepository();

export default accountRepository;
