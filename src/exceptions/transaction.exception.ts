import { HttpException } from "./http.execption.js";

export class TransactionException extends HttpException {
    constructor() {
        super("Transaction Failed", 500);
    }
}
