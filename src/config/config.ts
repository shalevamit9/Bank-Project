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
}

const config: IConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "config.json"), "utf-8")
);

export default config;
