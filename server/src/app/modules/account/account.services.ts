import { Account } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/handleApiError';
import { prisma } from '../../../shared/prisma';
import { AccountCreatedEvent, AccountUpdatedEvent } from './account.interfaces';

const insertIntoDB = async (
  userId: string,
  accountData: Account
): Promise<Account> => {
  // Check if the member exists
  const member = await prisma.member.findUnique({
    where: { memberId: userId },
  });

  console.log('member exists', member);
  if (!member) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found!');
  }

  const existingAccount = await prisma.account.findFirst({
    where: {
      memberId: userId,
      accountName: accountData?.accountName,
    },
  });

  console.log('existing account', existingAccount);
  if (existingAccount) {
    throw new ApiError(httpStatus.CONFLICT, 'Account already exists!');
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

    console.log('account', account);
    const description = `${accountData?.accountName} (Initial Deposit)`;

    console.log('description', description);
    const transaction = await tx.transaction.create({
      data: {
        memberId: userId,
        description,
        type: 'INCOME',
        status: 'COMPLETED',
        amount: accountData?.accountBalance,
        source: accountData?.accountName,
      },
    });

    console.log('account.....', account);
    console.log('transaction...', transaction);
    return account;
  });
};

const createFromEvent = async (e: AccountCreatedEvent) => {
  const accountData: Partial<Account> = {
    id: e.id,
    memberId: e.memberId,
    accountName: e.accountName,
    accountNumber: e.accountNumber,
    accountBalance: e.accountBalance,
  };

  const userId = accountData?.memberId;

  const data = await insertIntoDB(userId as string, accountData as Account);
  console.log('Account Result:', data);

  return data;
};

const updateFromEvent = async (e: AccountUpdatedEvent): Promise<void> => {
  const account: Partial<Account> = {
    id: e.id,
    memberId: e.memberId,
    accountName: e.accountName,
    accountNumber: e.accountNumber,
    accountBalance: e.accountBalance,
  };

  const data = await prisma.account.update({
    where: {
      id: e.id,
    },
    data: account as Account,
  });
  console.log('Result:', data);
};

const getAllFromDB = async (userId: string): Promise<Account[]> => {
  const result = await prisma.account.findMany({
    where: { memberId: userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, failed to retrieve data!');
  }

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

    console.log('account updated', account);
    const description = `${account.accountName} (Deposit)`;
    console.log('description => ', description);
    const transaction = await tx.transaction.create({
      data: {
        memberId: userId,
        description,
        type: 'INCOME',
        status: 'COMPLETED',
        amount,
        source: account.accountName,
      },
    });

    console.log('transaction completed...', transaction);
    return account;
  });
};

export const AccountServices = {
  insertIntoDB,
  createFromEvent,
  updateFromEvent,
  getAllFromDB,
  insertMoneyIntoDB,
};
