import { Router } from 'express'
import { createAdmin, deleteAdmin, getAllAdmins, loginAdmin } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
import { superAdminMiddleware } from '../middlewares/superAdminMiddleware'

const router = Router()

router.get('/', [ authMiddleware, superAdminMiddleware ], getAllAdmins )

router.post('/', [ authMiddleware, superAdminMiddleware ], createAdmin )

router.post('/login', loginAdmin )

router.delete('/:userId', [ authMiddleware, superAdminMiddleware ], deleteAdmin )

export { router as adminRouter }
