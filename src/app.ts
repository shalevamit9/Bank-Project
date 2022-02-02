import express, { Application } from "express";
import log from "@ajar/marker";
import config from "./config/config.js";

const { HOST, PORT } = config;

class App {
    static readonly API_PATH = "/api";

    private readonly app: Application;

    constructor() {
        this.app = express();

        this.initializeMiddlewares();
        // this.initializeRoutes();
        // this.initializeErrorMiddlewares();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    private initializeRoutes() {
        throw new Error("Method not implemented.");
    }

    private initializeErrorMiddlewares() {
        throw new Error("Method not implemented.");
    }

    async start() {
        this.app.listen(PORT, HOST, () => {
            log.magenta(
                "api is live on",
                ` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`
            );
        });
    }
}

const app = new App();

export default app;
