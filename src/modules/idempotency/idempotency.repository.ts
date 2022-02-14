import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "../../db/mysql.connection.js";
import { IIdempotency } from "./idempotency.interface.js";

class IdempotencyRepository {
    async getIdempotency(access_key: string, idempotency_key: string) {
        const [rows] = (await db.query(
            `
    SELECT * 
    FROM idempotencies
    WHERE access_key = ? AND idempotency_key = ?`,
            [access_key, idempotency_key]
        )) as RowDataPacket[][];

        const idempotency = rows[0] as IIdempotency;
        return idempotency;
    }

    async createIdempotency(idempotency: IIdempotency) {
        const [result] = (await db.query(
            `
      INSERT INTO idempotencies SET ?`,
            idempotency
        )) as ResultSetHeader[];

        return !!result.affectedRows;
    }
}

const idempotencyRepository = new IdempotencyRepository();

export default idempotencyRepository;
