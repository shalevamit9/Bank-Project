import { IAccount, IAddress } from "../../types/accounts.interface.js";

export interface IBusinessAccount extends IAccount {
    company_id: number;
    company_name: string;
    context: string;
    address: IAddress;
}

export type ICreateBusinessDto = Omit<IBusinessAccount, "id">;
