import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AdminControllers } from './admin.controllers';
import { AdminValidations } from './admin.validations';

const router = express.Router();

router
  .route('/')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminControllers.getAllFromDB
  );

router
  .route('/:id')
  .get(
    // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminControllers.getByIdFromDB
  )
  .patch(
    validateRequest(AdminValidations.updateAdmin),
    // auth( USER_ROLES.ADMIN),
    AdminControllers.updateOneInDB
  )
  .delete(
    // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminControllers.deleteByIdFromDB
  );

export const AdminRoutes = router;
