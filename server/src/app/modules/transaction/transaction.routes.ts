import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { TransactionControllers } from './transaction.controllers';

const router = express.Router();

router
  .route('/create/:id')
  .post(auth(USER_ROLES.MEMBER), TransactionControllers.insertIntoDB);

router
  .route('/')
  .get(auth(USER_ROLES.MEMBER), TransactionControllers.getAllFromDB);

router
  .route('/transfer')
  .put(auth(USER_ROLES.MEMBER), TransactionControllers.transferFundsInsideDB);

export const TransactionRoutes = router;
