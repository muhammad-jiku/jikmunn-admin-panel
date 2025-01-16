import { RedisClient } from '../../../shared/redis';
import { UserServices } from '../user/user.services';
import { EVENT_MEMBER_CREATED, EVENT_MEMBER_UPDATED } from './member.constants';

export const initMemberEvents = () => {
  RedisClient.subscribe(EVENT_MEMBER_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    await UserServices.createMemberFromEvent(data);
  });

  RedisClient.subscribe(EVENT_MEMBER_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('data..', data);
    await UserServices.updateMemberFromEvent(data);
  });
};
