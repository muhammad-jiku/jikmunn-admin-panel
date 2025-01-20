import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { SuperAdminControllers } from './superAdmin.controllers';
import { SuperAdminValidations } from './superAdmin.validations';

const router = express.Router();

router.route('/').get(
  // auth(USER_ROLES.SUPER_ADMIN),
  SuperAdminControllers.getAllFromDB
);

router
  .route('/:id')
  .get(
    // auth( USER_ROLES.SUPER_ADMIN ),
    SuperAdminControllers.getByIdFromDB
  )
  .patch(
    validateRequest(SuperAdminValidations.updateSuperAdmin),
    // auth(USER_ROLES.SUPER_ADMIN),
    SuperAdminControllers.updateOneInDB
  )
  .delete(
    // auth( USER_ROLES.SUPER_ADMIN ) ,
    SuperAdminControllers.deleteByIdFromDB
  );

export const SuperAdminRoutes = router;
