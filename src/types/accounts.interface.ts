export interface IAccount {
    account_id: number; // (primary ID)
    currency: string;
    balance: number;
    address: IAddress; // (Address Model)
    type: "individual" | "business" | "family";
    status: "active" | "inactive";
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
