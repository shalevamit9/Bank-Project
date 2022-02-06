import express from "express";
import individualController from "./individual.controller";



class IndividualRouter {
  readonly router = express.Router();

  constructor() {
      
      this.router.post("/individual", individualController.createIndividual);
  
      this.router.get("/individual/:id", individualController.getIndividual);
  }
}

const individualRouter = new IndividualRouter();

export default individualRouter;