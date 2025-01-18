import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACCOUNT_CREATED,
  EVENT_ACCOUNT_UPDATED,
} from './account.constants';
import { AccountServices } from './account.services';

export const initAccountEvents = () => {
  RedisClient.subscribe(EVENT_ACCOUNT_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('account event data created..', data);

    await AccountServices.createFromEvent(data);
  });

  RedisClient.subscribe(EVENT_ACCOUNT_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('account event data updated..', data);

    await AccountServices.updateFromEvent(data);
  });
};
