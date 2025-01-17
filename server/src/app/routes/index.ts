import express from 'express';
import { AccountRoutes } from '../modules/account/account.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { MemberRoutes } from '../modules/member/member.routes';
import { SuperAdminRoutes } from '../modules/superAdmin/superAdmin.routes';
import { TransactionRoutes } from '../modules/transaction/transaction.routes';
import { UserRoutes } from '../modules/user/user.routes';

const routes = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/members',
    route: MemberRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/super-admins',
    route: SuperAdminRoutes,
  },
  {
    path: '/transactions',
    route: TransactionRoutes,
  },
  {
    path: '/accounts',
    route: AccountRoutes,
  },
];

moduleRoutes.forEach((r) => routes.use(r.path, r.route));
export default routes;
