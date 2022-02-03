// /* eslint-disable class-methods-use-this */
// import { RowDataPacket, ResultSetHeader } from "mysql2";
// import { db } from "../../db/mysql.connection.js";
// import { IBusinessAccount, ICreateBusinessDto } from "./business.interface.js";

// class BusinessRepository {
//     // async getBusinessById(primaryId: number) {
//     //     const [accounts] = (await db.query(
//     //         "SELECT * FROM business_accounts WHERE id = ?",
//     //         primaryId
//     //     )) as RowDataPacket[][];
//     //     return accounts[0] as IBusinessAccount;
//     // }
//     // async createBusinessAccount(artistDto: ICreateBusinessDto) {
//     //     const [result] = (await db.query(
//     //         "INSERT INTO artists SET ?",
//     //         artistDto
//     //     )) as ResultSetHeader[];
//     //     const business = await this.getBusinessById(result.insertId);
//     //     return business;
//     // }
//     // async transferBusinessToBusiness(
//     //     sourceId: string,
//     //     destinationId: string,
//     //     amount: number
//     // ) {
//     //     throw new Error("Method not implemented.");
//     // }
//     // async transferBusinessToIndividual(
//     //     sourceId: string,
//     //     destinationId: string,
//     //     amount: number
//     // ) {
//     //     throw new Error("Method not implemented.");
//     // }
// }

// const artistRepository = new BusinessRepository();

// export default artistRepository;
