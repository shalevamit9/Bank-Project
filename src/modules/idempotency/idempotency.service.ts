import { IIdempotency } from "./idempotency.interface.js";
import idempotencyRepository from "./idempotency.repository.js";

class IdempotencyService {
    async getIdempotency(access_key: string, idempotency_key: string) {
        const idempotency = await idempotencyRepository.getIdempotency(
            access_key,
            idempotency_key
        );
        if (!idempotency) return null;
        return {
            access_key: idempotency.access_key,
            idempotency_key: idempotency.idempotency_key,
            request_params: idempotency.request_params,
            response: idempotency.response,
        } as IIdempotency;
    }

    async createIdempotency(idempotency: IIdempotency) {
        const isInserted = await idempotencyRepository.createIdempotency(
            idempotency
        );
        return isInserted;
    }
}

const idempotencyService = new IdempotencyService();

export default idempotencyService;
