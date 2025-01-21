import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AccountControllers } from './account.controllers';
import { AccountValidations } from './account.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.MEMBER),
    validateRequest(AccountValidations.createAccount),
    AccountControllers.insertIntoDB
  );

router.route('/').get(auth(USER_ROLES.MEMBER), AccountControllers.getAllFromDB);

router
  .route('/:id/add-money')
  .put(
    auth(USER_ROLES.MEMBER),
    validateRequest(AccountValidations.addMoneyToAccount),
    AccountControllers.insertMoneyIntoDB
  );

export const AccountRoutes = router;
