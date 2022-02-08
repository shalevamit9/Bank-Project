import { ICreateAccount } from "./account.interface.js";
import accountRepository from "./account.repository.js";

class AccountService {
    async createAccount(create_account: ICreateAccount) {
        const account = await accountRepository.createAccount(create_account);
        return account;
    }
}

const accountService = new AccountService();

export default accountService;
