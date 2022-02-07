import { RowDataPacket } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import { IAddress } from "../../types/accounts.interface";

class AddressRepository {
    async getAddressById(address_id: number) {
        const [addresses] = (await db.query(
            "SELECT * FROM addresses WHERE address_id = ?",
            address_id
        )) as RowDataPacket[][];

        return addresses[0] as IAddress;
    }
}

const addressRepository = new AddressRepository();

export default addressRepository;
