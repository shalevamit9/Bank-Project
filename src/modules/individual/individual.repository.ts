/* eslint-disable class-methods-use-this */
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import {
    IUpdateIndividualDto,
    ICreateIndividualAccount,
    IIndividualAccount,
} from "./individual.interface.js";

class IndividualRepository {
    getIndividualById = async (individual_account_id: number) => {
        const query = `SELECT * 
        FROM individual_accounts ia 
        JOIN accounts a on ia.account_id = a.account_id
        LEFT JOIN addresses ad ON ia.address_id = ad.address_id
        WHERE individual_account_id = ?`;
        const [users] = (await db.query(
            query,
            individual_account_id
        )) as RowDataPacket[][];
        return users[0] as IIndividualAccount;
    };

    getIndividuals = async (individual_ids: number[]) => {
        const questionMarks = Array(individual_ids.length).fill("?").join(",");
        const [accounts] = (await db.query(
            `SELECT * 
            FROM individual_accounts ia
            JOIN accounts a on ia.account_id = a.account_id
            WHERE individual_account_id IN (${questionMarks})`,
            individual_ids
        )) as RowDataPacket[][];

        return accounts as IIndividualAccount[];
    };

    createIndividualAccount = async (payload: ICreateIndividualAccount) => {
        const query = "INSERT INTO individual_accounts SET ?";
        const [result] = (await db.query(query, [
            payload,
        ])) as ResultSetHeader[];
        const individual_dto = this.getIndividualById(result.insertId);
        return individual_dto;
    };

    updateIndividualByID = async (
        id: number,
        payload: IUpdateIndividualDto
    ) => {
        const query = "UPDATE individual_accounts SET ? WHERE id = ?";
        await db.query(query, [payload, id]);
        const individual_dto = await this.getIndividualById(id);
        return individual_dto;
    };
}

const individualRepository = new IndividualRepository();

export default individualRepository;
