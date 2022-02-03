import express, { Application } from "express";
import log from "@ajar/marker";
import config from "./config/config.js";
import businessRouter from "./modules/business/business.router.js";
import connectDb from "./db/mysql.connection.js";

const { HOST, PORT } = config;

class App {
    static readonly API_PATH = "/api";

    private readonly app: Application;

    constructor() {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeRoutes();
        // this.initializeErrorMiddlewares();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    private initializeRoutes() {
        const { API_PATH } = App;
        this.app.use(`${API_PATH}/business`, businessRouter.router);
    }

    private initializeErrorMiddlewares() {
        throw new Error("Method not implemented.");
    }

    async start() {
        await connectDb();
        this.app.listen(Number(PORT), HOST, () => {
            log.magenta(
                "api is live on",
                ` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`
            );
        });
    }
}

const app = new App();

export default app;
