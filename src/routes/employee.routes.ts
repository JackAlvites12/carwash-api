import { Router } from "express";
import { createEmployee, getAllEmployees, getEmployeeById, updateEmployee } from "../controllers/employee.controller";

const router = Router()

router.get('/', getAllEmployees )

router.get('/:employeeId', getEmployeeById )

router.post('/', createEmployee )

router.patch('/:employeeId', updateEmployee )


export { router as employeeRouter }