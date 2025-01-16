import { Super_Admin } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { superAdminFilterableFields } from './superAdmin.constants';
import { SuperAdminServices } from './superAdmin.services';

const getAllFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, superAdminFilterableFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

      const result = await SuperAdminServices.getAllFromDB(filters, options);

      sendResponse<Super_Admin[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Super Admins data fetched successfully!!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const getByIdFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await SuperAdminServices.getByIdFromDB(id);

      sendResponse<Super_Admin>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Super Admin data fetched successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const updateOneInDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = await req.body;

      const result = await SuperAdminServices.updateOneInDB(id, payload);

      sendResponse<Super_Admin>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Super Admin updated successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const deleteByIdFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await SuperAdminServices.deleteByIdFromDB(id);

      sendResponse<Super_Admin>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Super Admin deleted successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const SuperAdminControllers = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
