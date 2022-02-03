
export interface IAccount {
    account_id: number;  // (primary ID)
    currency: string;
    balance: number;
    status: string;  // (active / inactive)
    address: IAddress; // (Address Model)
    type: string;  //  ( individual / business / family)
}