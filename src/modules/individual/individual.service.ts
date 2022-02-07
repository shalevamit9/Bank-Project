/* eslint-disable class-methods-use-this */
import individualRepository from "./individual.repository.js";
import { ICreateIndividualDto } from "./individual.interface.js";


class IndividualService {
  createIndividual = async (payload : ICreateIndividualDto) => {
  const individual = await individualRepository.createIndividual(payload);
  return individual;
  };

  getIndividualById = async (id : number) => {
    const individual = await individualRepository.getIndividual(id);
    return individual;
  };

}

const individualService = new IndividualService();

export default individualService;