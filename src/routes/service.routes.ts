import { Router } from "express";
import { createService, getAllServices, getServiceById, registerPaymentInService, updateService } from "../controllers/service.controller";

const router = Router()

router.get('/', getAllServices )

router.get('/:serviceId', getServiceById )

router.post('/', createService )

router.patch('/:serviceId', updateService )

router.patch('/register-payment/:serviceId' , registerPaymentInService )

export { router as serviceRouter }