import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { TransactionControllers } from './transaction.controllers';
import { TransactionValidations } from './transaction.validations';

const router = express.Router();

router
  .route('/:id/create')
  .post(
    auth(USER_ROLES.MEMBER),
    validateRequest(TransactionValidations.createTransaction),
    TransactionControllers.insertIntoDB
  );

router
  .route('/')
  .get(auth(USER_ROLES.MEMBER), TransactionControllers.getAllFromDB);

router
  .route('/transfer')
  .put(
    auth(USER_ROLES.MEMBER),
    validateRequest(TransactionValidations.transferFunds),
    TransactionControllers.transferFundsInsideDB
  );

export const TransactionRoutes = router;
