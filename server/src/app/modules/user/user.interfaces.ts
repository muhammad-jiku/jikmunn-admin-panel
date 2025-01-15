// Interfaces
export interface IMember {
  id?: string; // Optional because it will be auto-generated
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
}

export interface IAdmin {
  id?: string; // Optional because it will be auto-generated
  adminId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
}

export interface ISuperAdmin {
  id?: string; // Optional because it will be auto-generated
  superAdminId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
}

//
export type MemberCreatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
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
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
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
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};

export type AdminUpdatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};

export type SuperAdminCreatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};

export type SuperAdminUpdatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  profileImage?: string;
  email: string;
  contact: string;
  gender: 'MALE' | 'FEMALE'; // Enum based on Gender
};
