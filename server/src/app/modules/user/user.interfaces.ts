// Interfaces

//
export type MemberCreatedEvent = {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
  provider?: string;
  country?: string;
  currency?: string; // Defaults to "USD"
};

export type MemberUpdatedEvent = {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
  provider?: string;
  country?: string;
  currency?: string; // Defaults to "USD"
};

export type AdminCreatedEvent = {
  id: string;
  adminId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};

export type AdminUpdatedEvent = {
  id: string;
  adminId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};

export type SuperAdminCreatedEvent = {
  id: string;
  superAdminId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};

export type SuperAdminUpdatedEvent = {
  id: string;
  superAdminId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};
