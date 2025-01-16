import { RedisClient } from '../../../shared/redis';
import { UserServices } from '../user/user.services';
import { EVENT_ADMIN_CREATED, EVENT_ADMIN_UPDATED } from './admin.constants';

export const initAdminEvents = () => {
  RedisClient.subscribe(EVENT_ADMIN_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('admin data created..', data);

    await UserServices.createMemberFromEvent(data);
  });

  RedisClient.subscribe(EVENT_ADMIN_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('admin data updated..', data);

    await UserServices.updateSuperAdminFromEvent(data);
  });
};
