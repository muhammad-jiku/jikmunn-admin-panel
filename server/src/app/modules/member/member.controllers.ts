import { Member } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { memberFilterableFields } from './member.constants';
import { IDashboardInformation } from './member.interfaces';
import { MemberServices } from './member.services';

const getAllFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, memberFilterableFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

      const result = await MemberServices.getAllFromDB(filters, options);

      sendResponse<Member[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Members data fetched successfully!!',
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

      const result = await MemberServices.getByIdFromDB(id);

      sendResponse<Member>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Member data fetched successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const getDashboardInformation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const result = await MemberServices.getDashboardInformation(user!.userId);

      sendResponse<IDashboardInformation>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Dashboard data fetched successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const updateIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = await req.body;

      const result = await MemberServices.updateIntoDB(id, payload);

      sendResponse<Member>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Member data updated successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const deleteFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await MemberServices.deleteFromDB(id);

      sendResponse<Member>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Member data deleted successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const MemberControllers = {
  getAllFromDB,
  getByIdFromDB,
  getDashboardInformation,
  updateIntoDB,
  deleteFromDB,
};
