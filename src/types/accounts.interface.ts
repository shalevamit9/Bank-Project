export enum AccountType {
    Individual = "Individual",
    Business = "Business",
    Family = "Family",
}

export enum AccountStatus {
    Active = "Active",
    Inactive = "Inactive",
}

export interface IAccount {
    account_id: number; // (primary ID)
    currency: string;
    balance: number;
    address: IAddress;
    type: AccountType; // "individual" | "business" | "family";
    status: AccountStatus; // "active" | "inactive";
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
