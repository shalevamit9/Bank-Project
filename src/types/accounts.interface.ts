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
    account_id: number; // (primary ID)
    currency: string;
    balance: number;
    type: AccountTypes; // "Individual" | "Business" | "Family";
    status: AccountStatuses; // 0 | 1;
}

export interface IAddress {
    address_id: number;
    country_name: string;
    country_code: string;
    postal_code: number;
    city: string;
    region: string;
    street_name: string;
    street_number: number;
}

export type BalanceTransfer = [balance: number, amount: number];
