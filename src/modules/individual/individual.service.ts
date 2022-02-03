/* eslint-disable class-methods-use-this */
import individualRepository from "./individual.repository";



class IndividualService {
  createIndividual = async (payload : any) => {
  const individual = await individualRepository.createIndividual(payload);
  return individual;
  };

  getIndividual = async (id : number) => {
    const individual = await individualRepository.getIndividual(id);
    return individual;
  };

  addIndividualToFamily = async (individual_id : number, family_id : number) => {
    const individual = await individualRepository.updateIndividualByID(individual_id, {family_id});
    return individual; 
  };

  removeIndividualFromFamily = async (individual_id : number) => {
    const individual = await individualRepository.updateIndividualByID(individual_id, {family_id : null});
    return individual; 
  };
}

const individualService = new IndividualService();

export default individualService;