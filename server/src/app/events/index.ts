import { initAdminEvents } from '../modules/admin/admin.events';
import { initMemberEvents } from '../modules/member/member.events';
import { initSuperAdminEvents } from '../modules/superAdmin/superAdmin.events';

const subscribeToEvents = () => {
  initMemberEvents();
  initAdminEvents();
  initSuperAdminEvents();
};

export default subscribeToEvents;
