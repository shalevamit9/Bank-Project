import { AccountStatuses, AccountTypes, TransferTuple, IAccount } from "../../types/accounts.interface.js";
import { IIndividualAccountDto } from "../individual/individual.interface.js";

export interface IFamilyAccountDto extends IAccount {
    family_account_id: number;
    context?: string; // (travel / morgage / emergency / savings / checking) --> free text
    owners?: IIndividualAccountDto[] | number[]; //  collection of IndividualAccount models or IDs
}

export interface IFamilyAccount {
    family_account_id: number;
    context?: string; // (travel / morgage / emergency / savings / checking) --> free text
    account_id: number;
    currency: string;
    balance: number;
    status: AccountStatuses;
    type: AccountTypes;
}

export type ICreateFamily = Pick<IFamilyAccountDto, "currency" | "context"> & {
    owners: TransferTuple[];
};

export type IUpdateMembers = {
    individual_accounts: TransferTuple[];
};
export type IFamilyAccountDB = Partial<IFamilyAccountDto>;
