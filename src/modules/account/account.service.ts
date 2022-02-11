import { IAccount } from "../../types/accounts.interface.js";
import { ICreateAccount } from "./account.interface.js";
import accountRepository from "./account.repository.js";

export interface ITransaction {
    source_account: {
        account_id: number;
        balance: number;
        currency: string;
    };
    destination_account: {
        account_id: number;
        balance: number;
        currency: string;
    };
    fx_rate?: number;
}

class AccountService {
    async getAccountById(account_id: number) {
        const account = await accountRepository.getAccountById(account_id);
        return account;
    }

    async createAccount(create_account: ICreateAccount) {
        const account = await accountRepository.createAccount(create_account);
        return account;
    }

    async transfer(
        source_account: IAccount,
        destination_account: IAccount,
        source_amount: number,
        destination_amount: number
    ) {
        const isTransfered = await accountRepository.transfer(
            source_account,
            destination_account,
            source_amount,
            destination_amount
        );
        if (!isTransfered) return null;

        const transaction: ITransaction = {
            source_account: {
                account_id: source_account.account_id,
                balance: source_account.balance,
                currency: source_account.currency,
            },
            destination_account: {
                account_id: destination_account.account_id,
                balance: destination_account.balance,
                currency: destination_account.currency,
            },
        };
        return transaction;
    }
}

const accountService = new AccountService();

export default accountService;
