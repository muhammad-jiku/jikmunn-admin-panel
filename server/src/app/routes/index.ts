import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';

const routes = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => routes.use(route.path, route.route));
export default routes;
