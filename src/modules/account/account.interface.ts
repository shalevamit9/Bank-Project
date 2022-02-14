import { AccountStatuses, AccountTypes, IAccount } from "../../types/accounts.interface.js";

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ICreateAccount = Omit<PartialBy<IAccount, "status">, "account_id">;
// export type IUpdateAccount = {
//     accounts_ids: number[];
//     action: "activate" | "deactivate";
// };

export type IUpdateAccount = {
    accounts_ids: ActivationTuple[];
    action: "activate" | "deactivate";
};

export type StatusTuple = [account_id: number, status: AccountStatuses, type: AccountTypes];
export type ActivationTuple = [primary_id: number, type: AccountTypes];