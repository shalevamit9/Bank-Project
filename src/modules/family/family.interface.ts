import { IAccount } from "../../types/accounts.interface.js";
import { IIndividualAccountDto } from "../individual/individual.interface.js";
import { amountTransfer } from "../../types/accounts.interface.js";

export interface IFamilyAccountDto extends IAccount {
    context: string; // (travel / morgage / emergency / savings / checking) --> open text
    owners: IIndividualAccountDto[]; //  ( collection of IndividualAccount models )
}

// what will be the primary key in the database? a meaningless id?

export type ICreateFamily = Omit<IFamilyAccountDto, "account_id">;
export type IFamilyCreate = {family_account_model : ICreateFamily, owners: amountTransfer[], currency: string};