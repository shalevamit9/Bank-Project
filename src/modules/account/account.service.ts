import { BadRequest } from "../../exceptions/badRequest.exception.js";
import {
    AccountStatuses,
    AccountTypes,
    IAccount,
} from "../../types/accounts.interface.js";
import { ActivationTuple, ICreateAccount } from "./account.interface.js";
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

    async changeAccountsStatuses(
        accounts_ids: ActivationTuple[],
        action: string
    ) {
        const status =
            action === "activate"
                ? AccountStatuses.Active
                : AccountStatuses.Inactive;

        const individual_accounts_ids = accounts_ids.reduce(
            (acc, account_tuple) => {
                if (account_tuple[1] !== AccountTypes.Individual) return acc;
                acc.push(account_tuple[0]);
                return acc;
            },
            [] as number[]
        );

        const business_accounts_ids = accounts_ids.reduce(
            (acc, account_tuple) => {
                if (account_tuple[1] !== AccountTypes.Business) return acc;
                acc.push(account_tuple[0]);
                return acc;
            },
            [] as number[]
        );

        if (
            individual_accounts_ids.length + business_accounts_ids.length !==
            accounts_ids.length
        ) {
            throw new BadRequest(
                "Please provide only valid accounts (family accounts are not allowed)"
            );
        }

        const status_changed = await accountRepository.changeAccountsStatuses(
            individual_accounts_ids,
            business_accounts_ids,
            status
        );

        if (!status_changed) {
            throw new BadRequest("Failed to change status");
        }

        return {
            accounts_ids,
            status: status === AccountStatuses.Active ? "Active" : "Inactive",
        };
    }
}

const accountService = new AccountService();

export default accountService;
