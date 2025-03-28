import { Router } from 'express'
import { checkAuthentication, checkEmail, checkIsSuperAdmin, checkUsername, login, logout, signUp } from '../controllers/user.controller'

const router = Router()


router.post('/login', login )

router.post('/signup', signUp )

router.get('/checkAuthentication', checkAuthentication )

router.get('/checkIsSuperAdmin', checkIsSuperAdmin )

router.post('/checkEmail', checkEmail )

router.post('/checkUsername', checkUsername )

router.get('/logout', logout )


export { router as userRouter }