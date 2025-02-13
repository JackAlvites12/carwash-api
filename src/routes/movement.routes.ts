import { Router } from "express";
import { getAllMovements } from "../controllers/movement.controller";

const router = Router()

router.get('/', getAllMovements )

export { router as movementRouter }