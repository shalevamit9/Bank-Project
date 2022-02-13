import fs from "fs";
import path from "path";

interface IConfig {
    NODE_ENV: string;
    HOST: string;
    PORT: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    APP_SECRET: string;
    ACCESS_TOKEN_EXPIRATION: string;
    REFRESH_TOKEN_EXPIRATION: string;
    INDIVIDUAL_MINIMUM_ALLOWED_BALANCE: number;
    BUSINESS_MINIMUM_ALLOWED_BALANCE: number;
    FAMILY_MINIMUM_ALLOWED_BALANCE: number;
    BUSINESS_MAX_TRANSFER_LIMIT_SAME_COMPANY: number;
    BUSINESS_MAX_TRANSFER_LIMIT_OTHER_COMPANY: number;
    BUSINESS_MAX_TRANSFER_LIMIT_INDIVIDUAL: number;
    FAMILY_MAX_TRANSFER_LIMIT: number;
}

const config: IConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "config.json"), "utf-8")
);

export default config;
