import { Account } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { AccountServices } from './account.services';

const insertIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const result = await AccountServices.insertIntoDB(user.userId, req.body);

      sendResponse<Account>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Account created successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const getAllFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const result = await AccountServices.getAllFromDB(user.userId);

      sendResponse<Account[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Accounts data retrieved successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const insertMoneyIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { accountBalance } = await req.body;

      const result = await AccountServices.insertMoneyIntoDB(
        id,
        user.userId,
        Number(accountBalance)
      );

      sendResponse<Account>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Money added to the account successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const AccountControllers = {
  insertIntoDB,
  getAllFromDB,
  insertMoneyIntoDB,
};
