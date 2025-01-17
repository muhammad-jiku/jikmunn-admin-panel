import { z } from 'zod';

// Validation for creating an account
const createAccount = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User ID is required.',
    }),
    name: z.string({
      required_error: 'Account name is required.',
    }),
    accountNumber: z.string({
      required_error: 'Account number is required.',
    }),
    amount: z
      .number({
        required_error: 'Initial deposit amount is required.',
      })
      .positive('Amount must be greater than 0.'),
  }),
});

// Validation for adding money to an account
const addMoneyToAccount = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Account ID is required.',
    }),
  }),
  body: z.object({
    userId: z.string({
      required_error: 'User ID is required.',
    }),
    amount: z
      .number({
        required_error: 'Amount is required.',
      })
      .positive('Amount must be greater than 0.'),
  }),
});

export const AccountValidations = {
  createAccount,
  addMoneyToAccount,
};
