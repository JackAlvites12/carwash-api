import { Router } from "express";
import { createCatalog, getAllCatalogs, getCatalogById, updateCatalog } from "../controllers/catalog.controller";

const router = Router()

router.get('/', getAllCatalogs )

router.get('/:catalogId', getCatalogById )

router.post('/', createCatalog )

router.patch('/:catalogId', updateCatalog )

// router.delete('/:catalogId', deleteCatalog )


export { router as catalogRouter }