import { HttpException } from "./http.execption.js";

export class UnauthorizedException extends HttpException {
    constructor() {
        super("Unauthorized", 401);
    }
}
