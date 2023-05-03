import express from 'express';
import { signup, login } from '../controllers/authenticationController'
import {checkUserDoesntExist, checkRolesExist} from '../middleware/validation'

export const authRouter = express.Router()

authRouter.post('/signup', checkUserDoesntExist, checkRolesExist, signup)

authRouter.post('/login', login )