import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "../../db/mysql.connection.js";
import { AccountStatuses, IAccount } from "./account.interface.js";
import { ICreateAccount, StatusTuple } from "./account.interface.js";

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

    async transfer(
        source_account: IAccount,
        destination_account: IAccount,
        source_amount: number,
        destination_amount: number
    ) {
        source_account.balance -= source_amount;
        destination_account.balance += destination_amount;

        const [result] = (await db.query(
            `UPDATE accounts SET balance = CASE WHEN account_id = ? THEN ?
        WHEN account_id = ? THEN ?
        END
        WHERE account_id = ? OR account_id = ?;`,
            [
                source_account.account_id,
                source_account.balance,
                destination_account.account_id,
                destination_account.balance,
                source_account.account_id,
                destination_account.account_id,
            ]
        )) as ResultSetHeader[];

        return !!result.affectedRows;
    }

    async getAccountsStatuses(accounts_ids: number[]) {
        const ids_placeholder = Array(accounts_ids.length).fill("?").join(",");
        const get_all_statuses = `SELECT account_id, status, type FROM accounts WHERE account_id IN (${ids_placeholder})`;

        const [accounts] = (await db.query(get_all_statuses, accounts_ids)) as RowDataPacket[][];

        return accounts.map((account) => [account.account_id, account.status, account.type]) as StatusTuple[];
    }

    async changeAccountsStatuses(
        accounts_ids: number[],
        status: AccountStatuses
    ) {
        const ids_placeholder = Array(accounts_ids.length).fill("?").join(",");
        const update_status = `UPDATE accounts SET status = ? WHERE account_id IN (${ids_placeholder})`;

        const [result] = (await db.query(update_status, [
            status,
            ...accounts_ids,
        ])) as ResultSetHeader[];

        return !!result.affectedRows;
    }
}

const accountRepository = new AccountRepository();

export default accountRepository;
