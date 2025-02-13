import { Router } from "express";
import { createCatalog, getAllCatalogs, getCatalogById } from "../controllers/catalog.controller";

const router = Router()

router.get('/', getAllCatalogs )

router.get('/:catalogId', getCatalogById )

router.post('/', createCatalog )

export { router as catalogRouter }