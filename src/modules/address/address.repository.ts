import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "../../db/mysql.connection.js";
import { IAddress } from "./address.interface.js";
import { ICreateAddress } from "./address.interface.js";

class AddressRepository {
    async getAddressById(address_id: number) {
        const [addresses] = (await db.query(
            "SELECT * FROM addresses WHERE address_id = ?",
            address_id
        )) as RowDataPacket[][];

        return addresses[0] as IAddress;
    }

    async createAddress(create_address: ICreateAddress) {
        const [result] = (await db.query(
            "INSERT INTO addresses SET ?",
            create_address
        )) as ResultSetHeader[];

        const address = await this.getAddressById(result.insertId);
        return address;
    }
}

const addressRepository = new AddressRepository();

export default addressRepository;
