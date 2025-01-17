import { Account } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/handleApiError';
import { prisma } from '../../../shared/prisma';

const insertIntoDB = async (
  userId: string,
  accountData: Account
): Promise<Account> => {
  const existingAccount = await prisma.account.findFirst({
    where: { memberId: userId, accountName: accountData?.accountName },
  });

  if (existingAccount) {
    throw new ApiError(httpStatus.CONFLICT, 'Account already exists.');
  }

  return await prisma.$transaction(async (tx) => {
    const account = await tx.account.create({
      data: {
        memberId: userId,
        accountName: accountData?.accountName,
        accountNumber: accountData?.accountNumber,
        accountBalance: accountData?.accountBalance,
      },
    });

    const description = `${accountData?.accountName} (Initial Deposit)`;

    await tx.transaction.create({
      data: {
        memberId: userId,
        description,
        type: 'INCOME',
        status: 'COMPLETED',
        amount: accountData?.accountBalance,
        source: accountData?.accountName,
      },
    });

    return account;
  });
};

const getAllFromDB = async (userId: string): Promise<Account[]> => {
  const result = await prisma.account.findMany({
    where: { memberId: userId },
    orderBy: { createdAt: 'desc' },
  });

  return result;
};

const insertMoneyIntoDB = async (
  accountId: string,
  userId: string,
  amount: number
): Promise<Account> => {
  if (isNaN(amount) || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid deposit amount.');
  }

  return await prisma.$transaction(async (tx) => {
    const account = await tx.account.update({
      where: { id: accountId },
      data: { accountBalance: { increment: amount } },
    });

    const description = `${account.accountName} (Deposit)`;

    await tx.transaction.create({
      data: {
        memberId: userId,
        description,
        type: 'INCOME',
        status: 'COMPLETED',
        amount,
        source: account.accountName,
      },
    });

    return account;
  });
};

export const AccountServices = {
  insertIntoDB,
  getAllFromDB,
  insertMoneyIntoDB,
};
