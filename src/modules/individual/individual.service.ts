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

<<<<<<< HEAD
    getIndividuals = async (individual_ids: number[]) => {
        const individuals = await individualRepository.getIndividuals(
            individual_ids
        );
        return individuals;
    };

    // addIndividualToFamily = async (individual_id : number, family_id : number) => {
    //   const individual = await individualRepository.updateIndividualByID(individual_id, {family_id});
    //   return individual;
    // };

    // removeIndividualFromFamily = async (individual_id : number) => {
    //   const individual = await individualRepository.updateIndividualByID(individual_id, {family_id : null});
    //   return individual;
    // };
=======
  getIndividualById = async (id : number) => {
    const individual = await individualRepository.getIndividual(id);
    return individual;
  };

>>>>>>> origin/validation
}

const individualService = new IndividualService();

export default individualService;
