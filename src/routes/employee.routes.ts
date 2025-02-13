import { Router } from "express";
import { createEmployee, getAllEmployees } from "../controllers/employee.controller";

const router = Router()

router.get('/', getAllEmployees )

router.post('/', createEmployee )

export { router as employeeRouter }