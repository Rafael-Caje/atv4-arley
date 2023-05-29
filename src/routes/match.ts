import { Router } from "express";
import SpentController from "../controllers/SpentController";

const routes = Router();

routes.get('/', SpentController.list);
routes.post('/', SpentController.create);
routes.put('/', SpentController.update);
routes.delete('/', SpentController.delete);

export default routes;