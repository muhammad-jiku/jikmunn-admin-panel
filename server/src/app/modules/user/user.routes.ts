import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserControllers } from './user.controllers';
import { UserValidations } from './user.validations';

const router = express.Router();

router
  .route('/create-member')
  .post(
    validateRequest(UserValidations.createMember),
    UserControllers.insertMemberIntoDB
  );

router
  .route('/create-admin')
  .post(
    validateRequest(UserValidations.createAdmin),
    UserControllers.insertAdminIntoDB
  );

router
  .route('/create-super-admin')
  .post(
    validateRequest(UserValidations.createSuperAdmin),
    UserControllers.insertSuperAdminIntoDB
  );

export const UserRoutes = router;
