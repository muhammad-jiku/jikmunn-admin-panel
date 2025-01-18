//
export type AccountCreatedEvent = {
  id: string;
  memberId: string;
  accountName: string;
  lastName: string;
  accountNumber: string;
  accountBalance: number;
};

export type AccountUpdatedEvent = {
  id: string;
  memberId: string;
  accountName: string;
  lastName: string;
  accountNumber: string;
  accountBalance: number;
};
