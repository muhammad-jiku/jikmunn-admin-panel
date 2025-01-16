import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { MemberControllers } from './member.controllers';
import { MemberValidations } from './member.validations';

const router = express.Router();

router
  .route('/dashboard')
  .get(auth(USER_ROLES.MEMBER), MemberControllers.getDashboardInformation);

router
  .route('/')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    MemberControllers.getAllFromDB
  );

router
  .route('/:id')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MEMBER),
    MemberControllers.getByIdFromDB
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MEMBER),
    validateRequest(MemberValidations.updateMember),
    MemberControllers.updateIntoDB
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    MemberControllers.deleteFromDB
  );

export const MemberRoutes = router;
