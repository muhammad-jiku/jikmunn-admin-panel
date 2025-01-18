import { RedisClient } from '../../../shared/redis';
import {
  EVENT_TRANSACTION_CREATED,
  EVENT_TRANSACTION_UPDATED,
} from './transaction.constants';
import { TransactionServices } from './transaction.services';

export const initTransactionEvents = () => {
  RedisClient.subscribe(EVENT_TRANSACTION_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('transaction event data created..', data);

    await TransactionServices.createFromEvent(data);
  });

  RedisClient.subscribe(EVENT_TRANSACTION_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('Transaction event data updated..', data);

    await TransactionServices.updateFromEvent(data);
  });
};
