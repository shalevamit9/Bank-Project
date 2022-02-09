import { amountTransfer, IAccount } from "../../types/accounts.interface.js";
import { IIndividualAccountDto } from "../individual/individual.interface.js";

export interface IFamilyAccount extends IAccount {
    family_account_id: number;
    context?: string; // (travel / morgage / emergency / savings / checking) --> free text
    owners?: IIndividualAccountDto[] | number[]; //  collection of IndividualAccount models or IDs
}

export type ICreateFamily = Pick<IFamilyAccount, "currency" | "context"> & {owners:amountTransfer[]};
export type IFamilyAccountDB = Partial<IFamilyAccount>;
