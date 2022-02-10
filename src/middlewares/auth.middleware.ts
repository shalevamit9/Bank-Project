import { Request, Response, RequestHandler, NextFunction } from "express";
import { db } from "../db/mysql.connection.js";
import { RowDataPacket } from "mysql2";
//import crypto from "crypto";
import CryptoJS from 'crypto-js';



interface IMerchant {
    merchant_id: number,
    secret_key: string,
    access_key: string
}

class Authentication {
    authenticationChecking: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const secret_key_hash = req.headers["secret_key_hash"];
        // 39033a17dee296e43794cebb4e89a30fe1a93f80af3977873c03bb3239101459
        const access_key = req.headers["access_key"]; 
        
        const [query_data] = (await db.query(
            `SELECT *
            FROM merchants
            WHERE access_key = ?`,
            [access_key]
        )) as RowDataPacket[][];

        const merchant = query_data[0] as IMerchant;
        //const hash = crypto.createHash('sha256').update(`$${merchant.secret_key}`).digest('hex');
        const payload :object= req.body;
        const hash = CryptoJS.HmacSHA256(JSON.stringify(payload), merchant.secret_key).toString();

        if(hash !== secret_key_hash) {
            console.log(`our hash: ${hash} \ngot hash: ${secret_key_hash}`);
            throw new Error("hashing went wrong");
        }

        next();
    };

    
}

const authentication = new Authentication();

export default authentication;
