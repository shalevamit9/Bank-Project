import { HttpException } from "./http.execption.js";

export class PreconditionException extends HttpException {
    constructor() {
        super("PRECONDITION FAILED", 412);
    }
}
