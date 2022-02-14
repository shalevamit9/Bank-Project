import { AccountStatuses, AccountTypes, IAccount} from "../account/account.interface.js";
import { IAddress } from "../address/address.interface.js";


export interface IBusinessAccountDto extends IAccount {
    business_account_id: number;
    company_id: number;
    company_name: string;
    context: string;
    address?: IAddress;
}

export type ICreateBusinessDto = Omit<
    Omit<Omit<IBusinessAccountDto, "id">, "account_id">,
    "business_account_id"
>;

export type IBusinessAccount = {
    business_account_id: number;
    company_name: string;
    company_id: number;
    context: string;
    account_id: number;
    address_id?: number;
    currency: string;
    balance: number;
    type: AccountTypes;
    status: AccountStatuses;
} & IAddress;

export interface ICreateBusinessAccount {
    company_name: string;
    company_id: number;
    context: string;
    account_id: number;
    address_id?: number;
}
