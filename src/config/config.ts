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

    config.TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG =
        updated_config.TRANSFER_AMOUNT_LIMITATION_FEATURE_FLAG;
});

export default config;
