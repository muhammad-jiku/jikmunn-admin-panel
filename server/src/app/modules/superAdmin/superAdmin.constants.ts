export const superAdminSearchableFields: string[] = [
  'id',
  'email',
  'contact',
  'name.firstName',
  'name.middleName',
  'name.lastName',
];

export const superAdminFilterableFields: string[] = [
  'searchTerm',
  'id',
  'email',
  'contact',
];

export const EVENT_SUPER_ADMIN_CREATED = 'super_Admin.created';
export const EVENT_SUPER_ADMIN_UPDATED = 'super_Admin.updated';
