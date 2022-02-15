import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import chokidar from "chokidar";

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
    TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG: boolean;
}

const config_file_path = path.join(process.cwd(), "config.json");

const config: IConfig = JSON.parse(fs.readFileSync(config_file_path, "utf-8"));

const config_watcher = chokidar.watch(config_file_path);

config_watcher.on("change", async () => {
    const updated_config: IConfig = JSON.parse(
        await fsp.readFile(config_file_path, "utf-8")
    );

    config.ACCESS_TOKEN_EXPIRATION = updated_config.ACCESS_TOKEN_EXPIRATION;
    config.APP_SECRET = updated_config.APP_SECRET;
    config.BUSINESS_MINIMUM_ALLOWED_BALANCE =
        updated_config.BUSINESS_MINIMUM_ALLOWED_BALANCE;
    config.DB_HOST = updated_config.DB_HOST;
    config.DB_NAME = updated_config.DB_NAME;
    config.DB_PASSWORD = updated_config.DB_PASSWORD;
    config.DB_PORT = updated_config.DB_PORT;
    config.DB_USERNAME = updated_config.DB_USERNAME;
    config.FAMILY_MINIMUM_ALLOWED_BALANCE =
        updated_config.FAMILY_MINIMUM_ALLOWED_BALANCE;
    config.HOST = updated_config.HOST;
    config.INDIVIDUAL_MINIMUM_ALLOWED_BALANCE =
        updated_config.INDIVIDUAL_MINIMUM_ALLOWED_BALANCE;
    config.NODE_ENV = updated_config.NODE_ENV;
    config.PORT = updated_config.PORT;
    config.REFRESH_TOKEN_EXPIRATION = updated_config.REFRESH_TOKEN_EXPIRATION;
    config.TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG =
        updated_config.TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG;
});

export default config;
