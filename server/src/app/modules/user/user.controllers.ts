import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { UserServices } from './user.services';

const insertMemberIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { member, ...userData } = req.body;
      const result = await UserServices.insertMemberIntoDB(member, userData);

      sendResponse<User>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const insertAdminIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { admin, ...userData } = req.body;
      const result = await UserServices.insertAdminIntoDB(admin, userData);

      sendResponse<User>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const insertSuperAdminIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { superAdmin, ...userData } = req.body;
      const result = await UserServices.insertSuperAdminIntoDB(
        superAdmin,
        userData
      );

      sendResponse<User>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully!!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const UserControllers = {
  insertMemberIntoDB,
  insertAdminIntoDB,
  insertSuperAdminIntoDB,
};
