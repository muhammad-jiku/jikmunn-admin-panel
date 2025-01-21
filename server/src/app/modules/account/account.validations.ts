import { z } from 'zod';

// Validation for creating an account
const createAccount = z.object({
  body: z
    .object({
      accountName: z.string({
        required_error: 'Account name is required.',
      }),
      accountNumber: z.string({
        required_error: 'Account number is required.',
      }),
      accountBalance: z
        .number({
          required_error: 'Initial deposit amount is required.',
        })
        .positive('Amount must be greater than 0.'),
    })
    .strict(),
});

// Validation for adding money to an account
const addMoneyToAccount = z.object({
  body: z
    .object({
      accountBalance: z
        .number({
          required_error: 'Amount is required.',
        })
        .positive('Amount must be greater than 0.'),
    })
    .strict(),
});

export const AccountValidations = {
  createAccount,
  addMoneyToAccount,
};
