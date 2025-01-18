//
export type TransactionCreatedEvent = {
  id: string;
  memberId: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  amount: number;
  source: string;
};

export type TransactionUpdatedEvent = {
  id: string;
  memberId: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  amount: number;
  source: string;
};
