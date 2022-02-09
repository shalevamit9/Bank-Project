import express, { Application } from "express";
import log from "@ajar/marker";
import config from "./config/config.js";
import businessRouter from "./modules/business/business.router.js";
import connectDb from "./db/mysql.connection.js";
import {
    errorLogger,
    errorResponse,
    printError,
    urlNotFound,
} from "./middlewares/errors.handler.js";
import path from "path";
import { attachRequestId } from "./middlewares/attachRequestId.middleware.js";
import { logger } from "./middlewares/logger.middleware.js";
import individualRouter from "./modules/individual/individual.router.js";
import familyRouter from "./modules/family/family.router.js";

const { HOST, PORT } = config;

class App {
    static readonly API_PATH = "/api";
    static readonly ERRORS_LOG_PATH = path.join(
        process.cwd(),
        "logs",
        "errors.log"
    );
    static readonly REQUESTS_LOG_PATH = path.join(
        process.cwd(),
        "logs",
        "requests.log"
    );

    private readonly app: Application;

    constructor() {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorMiddlewares();
    }

    private initializeMiddlewares() {
        this.app.use(attachRequestId);
        this.app.use(logger(App.REQUESTS_LOG_PATH));
        this.app.use(express.json());
    }

    private initializeRoutes() {
        const { API_PATH } = App;
        // this.app.use(`${API_PATH}/business`, businessRouter.router);
        this.app.use(`${API_PATH}/individual`, individualRouter.router);
        this.app.use(`${API_PATH}/family`, familyRouter.router);
    }

    private initializeErrorMiddlewares() {
        this.app.use(urlNotFound);
        this.app.use(printError);
        this.app.use(errorLogger(App.ERRORS_LOG_PATH));
        this.app.use(errorResponse);
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
