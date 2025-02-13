import { Router } from 'express'
import { createCustomer, deleteCustomer, getAllCustomers, updateCustomer } from '../controllers/customer.controller'

const router = Router()

router.get('/', getAllCustomers ) 
router.post('/', createCustomer )
router.patch('/:customerId', updateCustomer )
router.delete('/:customerId', deleteCustomer )

export { router as customerRouter }