import { HttpException } from "./http.execption.js";

export class BadRequest extends HttpException {
    constructor(message: string) {
        super(`Bad Request - ${message}`, 400);
    }
}
