import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { AccountControllers } from './account.controllers';

const router = express.Router();

router
  .route('/create')
  .post(auth(USER_ROLES.MEMBER), AccountControllers.insertIntoDB);

router
  .route('/:id')
  .get(auth(USER_ROLES.MEMBER), AccountControllers.getAllFromDB);

router
  .route('/:id/add-money')
  .put(auth(USER_ROLES.MEMBER), AccountControllers.insertMoneyIntoDB);

export const AccountRoutes = router;
