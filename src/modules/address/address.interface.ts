import { IAddress } from "../../types/accounts.interface.js";

export type ICreateAddress = Omit<IAddress, "address_id">;
