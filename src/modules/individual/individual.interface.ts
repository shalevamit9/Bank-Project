import {
    AccountStatuses,
    AccountTypes,
    IAccount,
    IAddress,
} from "../../types/accounts.interface.js";

export interface IIndividualAccountDto extends IAccount {
    individual_account_id: number;
    individual_id: number;
    first_name: string;
    last_name: string;
    email: string;
    address: IAddress;
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

export type ICreateIndividualDto = Omit<IIndividualAccountDto, "id">;
export type IUpdateIndividualDto = Partial<ICreateIndividualDto>;
