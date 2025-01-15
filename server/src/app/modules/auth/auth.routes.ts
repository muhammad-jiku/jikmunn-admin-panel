import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controllers';
import { AuthValidations } from './auth.validations';

const router = express.Router();

router
  .route('/login')
  .post(
    validateRequest(AuthValidations.loginUserHandler),
    AuthControllers.loginUserHandler
  );

router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidations.refreshTokenHandler),
    AuthControllers.refreshTokenHandler
  );

router
  .route('/change-password')
  .post(
    validateRequest(AuthValidations.changePasswordHandler),
    AuthControllers.changePasswordHandler
  );

export const AuthRoutes = router;
