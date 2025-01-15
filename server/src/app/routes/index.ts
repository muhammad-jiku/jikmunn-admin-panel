import express from 'express';

const routes = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '',
    route: '',
  },
];

moduleRoutes.forEach((route) => routes.use(route.path, route.route));
export default routes;
