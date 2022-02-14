
export enum AccountTypes {
    Individual = "Individual",
    Business = "Business",
    Family = "Family",
}

export enum AccountStatuses {
    Inactive = 0,
    Active = 1,
}

export interface IAccount {
    account_id: number;
    currency: string;
    balance: number;
    type: AccountTypes; // "Individual" | "Business" | "Family";
    status: AccountStatuses; // 0 | 1;
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ICreateAccount = Omit<PartialBy<IAccount, "status">, "account_id">;
export type IUpdateAccount = {
    accounts_ids: number[];
    action: "activate" | "deactivate";
};

export type StatusTuple = [account_id: number, status: AccountStatuses, type: AccountTypes];
