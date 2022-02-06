import express from "express";
import individualController from "./individual.controller.js";
import raw from "../../middlewares/route.async.wrapper.js";



class IndividualRouter {
  readonly router = express.Router();

  constructor() {
      
      this.router.post("/", raw(individualController.createIndividual));
  
      this.router.get("/:id", raw(individualController.getIndividual));
  }
}

const individualRouter = new IndividualRouter();

export default individualRouter;