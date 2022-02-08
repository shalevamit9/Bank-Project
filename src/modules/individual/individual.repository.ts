/* eslint-disable class-methods-use-this */
import { RowDataPacket } from "mysql2";
import { db } from "../../db/mysql.connection.js";
import {
    IUpdateIndividualDto,
    ICreateIndividualDto,
} from "./individual.interface.js";
import { IIndividualAccount } from "./individual.interface.js";

class IndividualRepository {
    createIndividual = async (payload: ICreateIndividualDto) => {
        const query = "INSERT INTO individual SET ?";
        const result = await db.query(query, [payload]);
        const match = result[0] as any[];
        const users = match === undefined ? null : match;
        return users;
    };

    getIndividualById = async (individual_account_id: number) => {
        const query =
            "SELECT * FROM individual_accounts WHERE individual_account_id = ?";
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

    updateIndividualByID = async (
        id: number,
        payload: IUpdateIndividualDto
    ) => {
        const query = "UPDATE individual SET ? WHERE id = ?";
        await db.query(query, [payload, id]);
        const individual = await this.getIndividualById(id);
        return individual;
    };
}

const individualRepository = new IndividualRepository();

export default individualRepository;
