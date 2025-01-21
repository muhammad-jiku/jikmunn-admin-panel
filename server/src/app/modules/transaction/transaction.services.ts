import {
  Prisma,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/handleApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { prisma } from '../../../shared/prisma';
import {
  TransactionCreatedEvent,
  TransactionUpdatedEvent,
} from './transaction.interfaces';

const insertIntoDB = async (
  id: string,
  transactionData: Transaction,
  userId: string
): Promise<Transaction | null> => {
  const amount = Number(transactionData.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid transaction amount');
  }

  console.log('id....', id);
  console.log('user id....', userId);
  console.log('trsaction data....', transactionData);
  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.update({
      where: { id },
      data: {
        accountBalance: { increment: amount },
      },
    });

    console.log('account updated', account);
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

    console.log('trasaction created', transaction);
    return transaction;
  });

  return result;
};

const createFromEvent = async (
  e: TransactionCreatedEvent
): Promise<Transaction | null> => {
  const transactionData: Partial<Transaction> = {
    id: e.id,
    memberId: e.memberId,
    description: e.description,
    type: e.type as TransactionType,
    status: e.status as TransactionStatus,
    amount: e.amount,
    source: e.source,
  };

  const id = transactionData?.id;
  const userId = transactionData?.memberId;
  const transaction = await insertIntoDB(
    id as string,
    transactionData as Transaction,
    userId as string
  );
  console.log('Transaction created:', transaction);

  return transaction;
};

const updateFromEvent = async (e: TransactionUpdatedEvent): Promise<void> => {
  const isExist = await prisma.transaction.findUnique({
    where: {
      id: e.id,
    },
  });

  if (!isExist) {
    await createFromEvent(e);
    return;
  }

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: e.id,
      },
      data: {
        description: e.description,
        status: e.status as TransactionStatus,
        amount: e.amount,
        source: e.source,
      },
    });

    console.log('Transaction updated:', updatedTransaction);
  } catch (error) {
    console.error('Error during transaction update:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update transaction'
    );
  }
};

// const getAllFromDB = async (
//   userId: string,
//   payload: any
// ): Promise<IGenericResponse<Transaction[]>> => {
//   const startDate = new Date(
//     payload?.df || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
//   );
//   const endDate = new Date(payload?.dt || new Date());

//   console.log('user ID...', userId);
//   console.log('payload query data...', payload);
//   console.log('start date...', startDate);
//   console.log('end date...', endDate);

//   const result = await prisma.transaction.findMany({
//     where: {
//       memberId: userId,
//       createdAt: { gte: startDate, lte: endDate },
//       OR: [
//         { description: { contains: payload?.s, mode: 'insensitive' } },
//         { status: payload?.s as TransactionStatus },
//         { source: { contains: payload?.s, mode: 'insensitive' } },
//       ],
//     },
//     orderBy: { createdAt: 'desc' },
//   });

//   console.log('result....', result);

//   return {
//     data: result,
//     meta: {
//       page: 1,
//       limit: 10,
//       total: result.length,
//     },
//   };
// };

const getAllFromDB = async (
  userId: string,
  payload: any
): Promise<IGenericResponse<Transaction[]>> => {
  const startDate = new Date(
    payload?.df || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const endDate = new Date(payload?.dt || new Date());

  console.log('Parsed Start Date:', startDate);
  console.log('Parsed End Date:', endDate);

  const searchCondition: Prisma.Enumerable<Prisma.TransactionWhereInput> =
    payload?.s
      ? [
          {
            description: {
              contains: payload.s,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          { status: payload.s as TransactionStatus },
          {
            source: {
              contains: payload.s,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ]
      : [];

  const result = await prisma.transaction.findMany({
    where: {
      memberId: userId,
      createdAt: { gte: startDate, lte: endDate },
      ...(searchCondition.length ? { OR: searchCondition } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('Query Result:', result);

  return {
    meta: {
      page: 1,
      limit: 10,
      total: result.length,
    },
    data: result,
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
  console.log('from account', fromAccount, 'to account', toAccount);
  console.log('amount', amount, 'transfer', transferAmount);

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

    console.log('from account model', fromAccountModel);
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

    console.log('to account model', toAccountModel);

    const a = await tx.account.update({
      where: { id: fromAccount },
      data: { accountBalance: { decrement: amount } },
    });
    console.log('updated from account', a);

    const description = `Transfer (${fromAccountModel.accountName} -> ${toAccountModel.accountName})`;
    console.log('description', description);
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

    console.log('[expenseTransaction, incomeTransaction]', [
      expenseTransaction,
      incomeTransaction,
    ]);
    return [expenseTransaction, incomeTransaction];
  });
};

export const TransactionServices = {
  insertIntoDB,
  createFromEvent,
  updateFromEvent,
  getAllFromDB,
  transferFundsInsideDB,
};
