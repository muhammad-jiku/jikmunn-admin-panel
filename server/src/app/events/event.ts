import { RedisClient } from '../../shared/redis';
import { UserServices } from '../modules/user/user.services';
import {
  EVENT_ADMIN_CREATED,
  EVENT_ADMIN_UPDATED,
  EVENT_SUPER_ADMIN_CREATED,
  EVENT_SUPER_ADMIN_UPDATED,
} from './event.constants';

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

export const initSuperAdminEvents = () => {
  RedisClient.subscribe(EVENT_SUPER_ADMIN_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('super admin data created..', data);

    await UserServices.createSuperAdminFromEvent(data);
  });

  RedisClient.subscribe(EVENT_SUPER_ADMIN_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log('super admin data updated..', data);

    await UserServices.updateSuperAdminFromEvent(data);
  });
};
