import express from 'express';
import { listUsers, acceptOrRejectUser } from '../controllers/userController';
import { verifyToken, verifyRoles } from '../middleware/authorization';

export const userRouter = express.Router()

userRouter.use(verifyToken);
userRouter.use(verifyRoles(["admin"]));

userRouter.get('/', listUsers);
userRouter.put('/:id', acceptOrRejectUser);
