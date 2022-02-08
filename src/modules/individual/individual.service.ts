/* eslint-disable class-methods-use-this */
import individualRepository from "./individual.repository.js";
import { ICreateIndividualDto } from "./individual.interface.js";

class IndividualService {
    createIndividual = async (payload: ICreateIndividualDto) => {
        const individual = await individualRepository.createIndividual(payload);
        return individual;
    };

    getIndividual = async (id: number) => {
        const individual = await individualRepository.getIndividual(id);
        return individual;
    };

    getIndividuals = async (individual_ids: number[]) => {
        const individuals = await individualRepository.getIndividuals(
            individual_ids
        );
        return individuals;
    };
}

const individualService = new IndividualService();

export default individualService;
