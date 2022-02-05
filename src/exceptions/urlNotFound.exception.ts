import { HttpException } from "./http.execption.js";

export class UrlNotFoundException extends HttpException {
    constructor(url: string) {
        super(`Url with path ${url} not found`, 404);
    }
}
