import { Transaction, TransactionStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/handleApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { prisma } from '../../../shared/prisma';

const insertIntoDB = async (
  id: string,
  transactionData: Transaction,
  userId: string
): Promise<Transaction | null> => {
  const amount = Number(transactionData.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid transaction amount');
  }

  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.update({
      where: { id },
      data: {
        accountBalance: { increment: amount },
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        memberId: userId,
        description: `${account.accountName} (Deposit)`,
        type: 'INCOME',
        status: 'COMPLETED',
        amount,
        source: account.accountName,
      },
    });

    return transaction;
  });

  return result;
};

const getAllFromDB = async (
  userId: string,
  payload: any
): Promise<IGenericResponse<Transaction[]>> => {
  const startDate = new Date(
    payload?.df || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const endDate = new Date(payload?.dt || new Date());

  const result = await prisma.transaction.findMany({
    where: {
      memberId: userId,
      createdAt: { gte: startDate, lte: endDate },
      OR: [
        { description: { contains: payload?.s, mode: 'insensitive' } },
        { status: payload?.s as TransactionStatus },
        { source: { contains: payload?.s, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    data: result,
    meta: {
      page: 1,
      limit: 10,
      total: result.length,
    },
  };
};

const transferFundsInsideDB = async (
  userId: string,
  payload: any
): Promise<Transaction[]> => {
  const { fromAccount, toAccount, amount } = await payload;
  if (!fromAccount || !toAccount || !amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Provide Required Fields!');
  }

  const transferAmount = Number(amount);

  if (isNaN(transferAmount) || transferAmount <= 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Amount should be greater than 0.'
    );
  }

  return await prisma.$transaction(async (tx) => {
    const fromAccountModel = await tx.account.findUnique({
      where: { id: fromAccount },
    });

    if (!fromAccountModel) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Source account not found.');
    }

    if (fromAccountModel.accountBalance < amount) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Insufficient balance in source account.'
      );
    }

    const toAccountModel = await tx.account.update({
      where: { id: toAccount },
      data: { accountBalance: { increment: amount } },
    });

    await tx.account.update({
      where: { id: fromAccount },
      data: { accountBalance: { decrement: amount } },
    });

    const description = `Transfer (${fromAccountModel.accountName} -> ${toAccountModel.accountName})`;

    const [expenseTransaction, incomeTransaction] = await Promise.all([
      tx.transaction.create({
        data: {
          memberId: userId,
          description,
          type: 'EXPENSE',
          status: 'COMPLETED',
          amount,
          source: fromAccountModel.accountName,
        },
      }),
      tx.transaction.create({
        data: {
          memberId: userId,
          description: `Received from ${fromAccountModel.accountName}`,
          type: 'INCOME',
          status: 'COMPLETED',
          amount,
          source: toAccountModel.accountName,
        },
      }),
    ]);

    return [expenseTransaction, incomeTransaction];
  });
};

export const TransactionServices = {
  insertIntoDB,
  getAllFromDB,
  transferFundsInsideDB,
};
