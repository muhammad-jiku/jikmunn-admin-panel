import { Account, Transaction } from '@prisma/client';

export type IMemberFilterRequest = {
  searchTerm?: string | undefined;
  memberId?: string | undefined;
  email?: string | undefined;
  contact?: string | undefined;
  gender?: string | undefined;
};

export interface IChartData {
  label: string; // Name of the month (e.g., "January")
  income: number; // Income for the month
  expense: number; // Expense for the month
}

export interface IDashboardInformation {
  availableBalance: number; // Total available balance
  totalIncome: number; // Total income
  totalExpense: number; // Total expense
  chartData: IChartData[]; // Array of monthly income and expense data
  lastTransactions: Transaction[]; // Array of recent transactions
  lastAccounts: Account[]; // Array of recent accounts
}
