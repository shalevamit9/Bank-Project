import { IAccount, IAddress } from "../../types/accounts.interface.js";

export interface IIndividualAccountDto extends IAccount {
    individual_id: number;
    first_name: string;
    last_name: string;
    email: string;
    address: IAddress;
}

export type ICreateIndividualDto = Omit<IIndividualAccountDto, "id">;
export type IUpdateIndividualDto = Partial<ICreateIndividualDto>;