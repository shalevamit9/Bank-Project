import fs from "fs";
import path from "path";

const { cwd } = process;

const config = JSON.parse(
    fs.readFileSync(path.join(cwd(), "config.json"), "utf-8")
);

export default config;
