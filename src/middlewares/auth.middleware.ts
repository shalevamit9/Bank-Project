import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";
import { UnauthorizedException } from "../exceptions/unauthorized.exception.js";
import { db } from "../db/mysql.connection.js";
import raw from "./route.async.wrapper.js";

interface IMerchant {
    merchant_id: number;
    secret_key: string;
    access_key: string;
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const verifyAuth: RequestHandler = raw(async (req, res, next) => {
    const secret_key_hash = req.headers["secret_key_hash"] as string;
    const access_key = req.headers["access_key"];

    const [query_data] = (await db.query(
        `SELECT *
        FROM merchants
        WHERE access_key = ?`,
        [access_key]
    )) as RowDataPacket[][];

    const merchant = query_data[0] as IMerchant;
    const hash = crypto
        .createHmac("sha256", merchant.secret_key)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (hash !== secret_key_hash) {
        throw new UnauthorizedException();
    }

    next();
});

export default verifyAuth;
