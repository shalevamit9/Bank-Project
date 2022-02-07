/* eslint-disable class-methods-use-this */
import { db } from "../../db/mysql.connection.js";
import { IUpdateIndividualDto, ICreateIndividualDto } from "./individual.interface.js";
import { RowDataPacket } from "mysql2";
import { IIndividualAccountDto } from "./individual.interface.js";


class IndividualRepository {
    createIndividual = async (payload : ICreateIndividualDto) => {
        const query = "INSERT INTO individual SET ?";
        const result = await db.query(query, [payload]);
        const match = result[0] as any[];
        const users = match === undefined ? null : match;
        return users;
    };

    getIndividual = async (id : number) => {
        const query = "SELECT * FROM individual WHERE id=?";
        const [users] = await db.query(query, [id]) as RowDataPacket[][];
        return users[0] as IIndividualAccountDto;
    };

    updateIndividualByID = async (id : number, payload : IUpdateIndividualDto) => {
        const query = "UPDATE individual SET ? WHERE id = ?";
        await db.query(query, [payload, id]);
        const individual = await this.getIndividual(id);
        return individual;
    };
}

const individualRepository = new IndividualRepository();

export default individualRepository;