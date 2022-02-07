import { IAccount } from "../../types/accounts.interface.js";
import { IIndividualAccount } from "../individual/individual.interface.js";

export interface IFamilyAccount extends IAccount {
    context: string; // (travel / morgage / emergency / savings / checking) --> open text
    owners: IIndividualAccount[] | number[]; //  ( collection of IndividualAccount models or IDs )
}

// what will be the primary key in the database? a meaningless id?

export type ICreateFamily = Omit<IFamilyAccount, "account_id">;
export type IFamilyAccountDB = Partial<IFamilyAccount>;