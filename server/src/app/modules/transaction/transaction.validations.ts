import { TransactionStatus, TransactionType } from '@prisma/client';
import { z } from 'zod';

const TransactionTypeEnum = z.enum(
  Object.values(TransactionType) as [string, ...string[]]
);

const TransactionStatusEnum = z.enum(
  Object.values(TransactionStatus) as [string, ...string[]]
);

const createTransaction = z.object({
  body: z
    .object({
      // id: z.string({
      //   required_error: 'Account ID is required',
      // }),
      // userId: z.string({
      //   required_error: 'User ID is required',
      // }),
      amount: z
        .number({
          required_error: 'Amount is required',
        })
        .positive('Amount must be greater than 0'),
      type: TransactionTypeEnum.default('INCOME'),
      status: TransactionStatusEnum.default('COMPLETED'),
      description: z.string().optional(),
      source: z.string().optional(),
    })
    .strict(),
});

const transferFunds = z.object({
  body: z
    .object({
      fromAccount: z.string({
        required_error: 'Source account ID is required.',
      }),
      toAccount: z.string({
        required_error: 'Destination account ID is required.',
      }),
      amount: z
        .number({
          required_error: 'Amount is required.',
        })
        .positive('Amount must be greater than 0.'),
    })
    .strict(),
});

export const TransactionValidations = {
  createTransaction,
  transferFunds,
};
