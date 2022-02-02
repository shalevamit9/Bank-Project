import log from "@ajar/marker";
import app from "./app.js";

app.start().catch(log.red);
