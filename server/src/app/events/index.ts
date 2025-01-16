import { initAdminEvents } from '../modules/admin/admin.events';
import { initMemberEvents } from '../modules/member/member.events';

const subscribeToEvents = () => {
  initMemberEvents();
  initAdminEvents();
};

export default subscribeToEvents;
