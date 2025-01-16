export const adminSearchableFields: string[] = [
  'id',
  'email',
  'contact',
  'name.firstName',
  'name.middleName',
  'name.lastName',
];

export const adminFilterableFields: string[] = [
  'searchTerm',
  'id',
  'email',
  'contact',
];

export const EVENT_ADMIN_CREATED = 'admin.created';
export const EVENT_ADMIN_UPDATED = 'admin.updated';
