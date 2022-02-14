import {
    IAddress,
} from "../address/address.interface.js";
import { AccountStatuses,
    AccountTypes,
    IAccount, } from "../account/account.interface.js";

export interface IIndividualAccountDto extends IAccount {
    individual_account_id: number;
    individual_id: number;
    first_name: string;
    last_name: string;
    email: string;
    address?: IAddress;
}

export type IIndividualAccount = {
    individual_account_id: number;
    individual_id: number;
    account_id: number;
    currency: string;
    balance: number;
    type: AccountTypes;
    status: AccountStatuses;
    first_name: string;
    last_name: string;
    email: string;
} & IAddress;

export interface ICreateIndividualAccount {
    first_name: string;
    last_name: string;
    email: string;
    account_id: number;
    individual_id: number;
    address_id?: number;
}



export type ICreateIndividualDto = Omit<Omit<Omit<IIndividualAccountDto, "id">, "account_id">, "individual_account_id">;
export type IUpdateIndividualDto = Partial<ICreateIndividualDto>;
