import { IAccount } from "../../types/accounts.interface.js";

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ICreateAccount = Omit<PartialBy<IAccount, "status">, "account_id">;
export type IUpdateAccount = {
    accounts_ids: number[];
    action: "activate" | "deactivate";
}