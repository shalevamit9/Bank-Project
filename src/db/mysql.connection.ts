import mysql from "mysql2/promise";
import config from "../config/config.js";

const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = config;

// eslint-disable-next-line import/no-mutable-exports
export let db: mysql.Connection;

// eslint-disable-next-line consistent-return
export default async function connectDb() {
    if (db) return db;

    db = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
    });
}
