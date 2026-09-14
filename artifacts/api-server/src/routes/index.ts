import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import placesRouter from "./places";
import plansRouter from "./plans";
import outingsRouter from "./outings";
import eventsRouter from "./events";
import routesRouter from "./routes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter, placesRouter, plansRouter, outingsRouter, eventsRouter, routesRouter);

export default router;
