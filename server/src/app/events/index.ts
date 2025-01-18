import { initAccountEvents } from '../modules/account/account.events';
import { initAdminEvents } from '../modules/admin/admin.events';
import { initMemberEvents } from '../modules/member/member.events';
import { initSuperAdminEvents } from '../modules/superAdmin/superAdmin.events';
import { initTransactionEvents } from '../modules/transaction/transaction.events';

const subscribeToEvents = () => {
  initMemberEvents();
  initAdminEvents();
  initSuperAdminEvents();
  initAccountEvents();
  initTransactionEvents();
};

export default subscribeToEvents;
