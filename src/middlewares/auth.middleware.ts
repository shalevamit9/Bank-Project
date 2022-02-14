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

const verifyAuth: RequestHandler = raw(async (req, res, next) => {
    const secret_key_hash = req.headers["secret_key_hash"] as string;
    const access_key = req.headers["access_key"];
    const auth_salt = req.headers["auth_salt"] as string;
    if (!auth_salt || !secret_key_hash || !access_key) {
        throw new UnauthorizedException();
    }

    const [merchants] = (await db.query(
        `SELECT *
        FROM merchants
        WHERE access_key = ?`,
        [access_key]
    )) as RowDataPacket[][];

    const merchant = merchants[0] as IMerchant;
    if (!merchant) throw new UnauthorizedException();

    const body =
        Object.keys(req.body as object).length > 0
            ? JSON.stringify(req.body)
            : "";
    const hash = crypto
        .createHmac("sha256", merchant.secret_key)
        .update(`${auth_salt}${body}`)
        .digest("hex");

    if (hash !== secret_key_hash) throw new UnauthorizedException();

    next();
});

export default verifyAuth;
