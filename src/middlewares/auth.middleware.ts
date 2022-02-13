import { Request, Response, RequestHandler, NextFunction } from "express";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";
import { UnauthorizedException } from "../exceptions/unauthorized.exception.js";
import { db } from "../db/mysql.connection.js";

interface IMerchant {
    merchant_id: number;
    secret_key: string;
    access_key: string;
}

class Authentication {
    authenticationChecking: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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
            .createHash("sha256")
            .update(`$${merchant.secret_key}`)
            .digest("hex");

        if (hash !== secret_key_hash) {
            throw new UnauthorizedException();
        }

        next();
    };
}

const authentication = new Authentication();

export default authentication;