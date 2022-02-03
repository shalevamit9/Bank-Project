export interface IIndividualAccount {
    id: number;
    currency: number;
    individual_id: string;
    first_name: string;
    last_name: string;
    address: string;
    balance: number;
    family_id: number | null;
    status: number;
}

export type ICreateIndividualDto = Omit<IIndividualAccount, "id">;
export type IUpdateIndividualDto = Partial<ICreateIndividualDto>;