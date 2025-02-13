import { Router } from "express";
import { getAllSales } from "../controllers/sale.controller";

const router = Router()

router.get('/', getAllSales )

export { router as saleRouter }