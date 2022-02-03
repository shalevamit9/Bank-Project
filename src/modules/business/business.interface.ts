export interface IBusinessAccount {
    id: number;
    currency: number;
    company_name: string;
    company_id: string;
    balance: number;
    status: number;
}

export type ICreateBusinessDto = Omit<IBusinessAccount, "id">;
