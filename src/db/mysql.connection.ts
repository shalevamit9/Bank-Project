import mysql from "mysql2/promise";
import config from "../config/config.js";

const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = config;

let connection: mysql.Connection;

export default async function getDbConnection() {
    if (connection) return connection;

    connection = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
    });

    return connection;
}
