import { IAccount } from "../../types/accounts.interface.js";
import { IIndividualAccount } from "../individual/individual.interface.js";

export interface IFamilyAccount extends IAccount {
    context: string; // (travel / morgage / emergency / savings / checking) 
    owners: IIndividualAccount[]; //  ( collection of IndividualAccount models )
}

export type ICreateFamily = Omit<IFamilyAccount, "account_id">;