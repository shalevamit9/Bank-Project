import { ICreateAccount } from "./account.interface.js";
import accountRepository from "./account.repository.js";

class AccountService {
    async getAccountById(account_id: number) {
        const account = await accountRepository.getAccountById(account_id);
        return account;
    }

    async createAccount(create_account: ICreateAccount) {
        const account = await accountRepository.createAccount(create_account);
        return account;
    }
}

const accountService = new AccountService();

export default accountService;
