import { Transaction } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { TransactionServices } from './transaction.services';

const insertIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user;

      const result = await TransactionServices.insertIntoDB(
        id,
        req.body,
        user!.userId
      );

      sendResponse<Transaction>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Transaction created successfully!!',
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
      const user = req.user;
      const { df, dt, s } = req.query;

      const result = await TransactionServices.getAllFromDB(user!.userId, {
        df,
        dt,
        s,
      });

      sendResponse<Transaction[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Transactions data fetched successfully!!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  }
);

const transferFundsInsideDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const result = await TransactionServices.transferFundsInsideDB(
        user!.userId,
        req.body
      );

      sendResponse<Transaction[]>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Funds transferred successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const TransactionControllers = {
  insertIntoDB,
  getAllFromDB,
  transferFundsInsideDB,
};
