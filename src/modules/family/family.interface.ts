export interface IFamilyAccount {
    id: number;
    currency: string;  //  USD, ILS
    balance: number;
    status: string;  // Active / Inactive
    // individualAccounts: number[];  // array of primary IDs of the family members accounts
}

export type ICreateFamily = Omit<IFamilyAccount, "id">;