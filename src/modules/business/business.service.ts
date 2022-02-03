/* eslint-disable class-methods-use-this */
import { ICreateBusinessDto } from "./business.interface.js";
import businessRepository from "./business.repository.js";

class BusinessService {
    async createBusinessAccount(businessDto: ICreateBusinessDto) {
        const business = await businessRepository.createBusinessAccount(
            businessDto
        );
        return business;
    }

    async transferBusinessToBusiness(
        sourceId: string,
        destinationId: string,
        amount: number
    ) {
        const transaction = await businessRepository.transferBusinessToBusiness(
            sourceId,
            destinationId,
            amount
        );
        return transaction;
    }

    async transferBusinessToIndividual(
        sourceId: string,
        destinationId: string,
        amount: number
    ) {
        const transaction =
            await businessRepository.transferBusinessToIndividual(
                sourceId,
                destinationId,
                amount
            );
        return transaction;
    }
}

const businessService = new BusinessService();

export default businessService;
