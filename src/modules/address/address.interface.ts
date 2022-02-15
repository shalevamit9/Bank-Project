export interface IAddress {
    address_id: number;
    country_name: string;
    country_code: string;
    postal_code: number;
    city: string;
    region: string;
    street_name: string;
    street_number: number;
}

export type ICreateAddress = Omit<IAddress, "address_id">;
