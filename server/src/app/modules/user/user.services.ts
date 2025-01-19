import {
  Admin,
  Gender,
  Member,
  Super_Admin,
  User,
  UserRole,
} from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/handleApiError';
import { prisma } from '../../../shared/prisma';
import { hashPassword } from '../auth/auth.utils';
import {
  AdminCreatedEvent,
  AdminUpdatedEvent,
  MemberCreatedEvent,
  MemberUpdatedEvent,
  SuperAdminCreatedEvent,
  SuperAdminUpdatedEvent,
} from './user.interfaces';
import {
  generateAdminId,
  generateMemberId,
  generateSuperAdminId,
} from './user.utils';

// Member creation
const insertMemberIntoDB = async (
  memberData: Member,
  userData: User
): Promise<User | null> => {
  if (!userData.password) {
    userData.password = config.default.member_pass as string;
  }

  // Hash the password before saving
  userData.password = await hashPassword(userData.password);
  userData.role = UserRole.MEMBER;

  try {
    // Step 1: Generate a unique member ID based on the academic semester
    const memberId = await generateMemberId();
    memberData.memberId = memberId;
    console.log('memberId: ', memberId);
    // Step 2: Create Member first to ensure the memberId exists
    const newMember = await prisma.member.create({
      data: {
        ...memberData,
      },
    });

    // Step 3: Now create the User with the new memberId
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        userId: newMember.memberId, // Set userId to match memberId
        memberId: newMember.memberId, // Link to the newly created Member
      },
    });

    console.log('Member created', newMember);
    console.log('User created:', newUser);

    return newUser;
  } catch (error) {
    console.error('Error during user creation:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create user profile'
    );
  }
};

// Sample function to handle an event and create a Member and User
const createMemberFromEvent = async (e: MemberCreatedEvent) => {
  const memberData: Partial<Member> = {
    id: e.id,
    memberId: e.memberId,
    firstName: e.firstName,
    lastName: e.lastName,
    middleName: e.middleName,
    email: e.email,
    contact: e.contact,
    gender: e.gender as Gender,
    profileImage: e.profileImage,
    provider: e.provider,
    country: e.country,
    currency: e.currency,
  };

  const userData: Partial<User> = {
    userId: e.memberId,
    password: config.default.member_pass as string,
    role: UserRole.MEMBER,
  };

  const data = await insertMemberIntoDB(memberData as Member, userData as User);
  console.log('Result:', data);
};

// Sample function to update member from an event
const updateMemberFromEvent = async (e: MemberUpdatedEvent): Promise<void> => {
  const isExist = await prisma.member.findFirst({
    where: {
      memberId: e.memberId,
    },
  });

  if (!isExist) {
    await createMemberFromEvent(e);
    return;
  } else {
    const member: Partial<Member> = {
      id: e.id,
      memberId: e.memberId,
      firstName: e.firstName,
      lastName: e.lastName,
      middleName: e.middleName,
      email: e.email,
      contact: e.contact,
      gender: e.gender as Gender,
      profileImage: e.profileImage,
      provider: e.provider,
      country: e.country,
      currency: e.currency,
    };
    await prisma.member.update({
      where: {
        memberId: e.memberId,
      },
      data: member as Member,
    });
  }
};

// Admin's id creation
const insertAdminIntoDB = async (
  adminData: Admin,
  userData: User
): Promise<User | null> => {
  if (!userData.password) {
    userData.password = config.default.admin_pass as string;
  }

  // Hash the password before saving
  userData.password = await hashPassword(userData.password);
  userData.role = UserRole.ADMIN;

  try {
    // Step 1: Generate a unique admin ID
    const adminId = await generateAdminId();
    adminData.adminId = adminId;
    console.log('adminId: ', adminId);
    // Step 2: Create Admin first to ensure the adminId exists
    const newAdmin = await prisma.admin.create({
      data: {
        ...adminData,
      },
    });

    // Step 3: Now create the User with the new adminId
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        userId: newAdmin.adminId, // Set userId to match adminId
        adminId: newAdmin.adminId, // Link to the newly created Admin
      },
    });

    console.log('Admin created:', newAdmin);
    console.log('User created:', newUser);

    return newUser;
  } catch (error) {
    console.error('Error during user creation:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create user profile'
    );
  }
};

// Sample function to handle an event and create a Admin and User
const createAdminFromEvent = async (e: AdminCreatedEvent) => {
  const adminData: Partial<Admin> = {
    id: e.id,
    adminId: e.adminId,
    firstName: e.firstName,
    lastName: e.lastName,
    middleName: e.middleName,
    email: e.email,
    profileImage: e.profileImage,
    contact: e.contact,
    gender: e.gender as Gender,
  };

  const userData: Partial<User> = {
    userId: e.adminId,
    password: config.default.admin_pass as string,
    role: UserRole.ADMIN,
  };

  const data = await insertAdminIntoDB(adminData as Admin, userData as User);
  console.log('Result:', data);
};

// Sample function to update admin from an event
const updateAdminFromEvent = async (e: AdminUpdatedEvent): Promise<void> => {
  const isExist = await prisma.admin.findFirst({
    where: {
      adminId: e.adminId,
    },
  });

  if (!isExist) {
    await createAdminFromEvent(e);
    return;
  } else {
    const admin: Partial<Admin> = {
      id: e.id,
      adminId: e.adminId,
      firstName: e.firstName,
      lastName: e.lastName,
      middleName: e.middleName,
      email: e.email,
      profileImage: e.profileImage,
      contact: e.contact,
      gender: e.gender as Gender,
    };
    await prisma.admin.update({
      where: {
        adminId: e.adminId,
      },
      data: admin as Admin,
    });
  }
};

// Super Admin's id creation
const insertSuperAdminIntoDB = async (
  superAdminData: Super_Admin,
  userData: User
): Promise<User | null> => {
  if (!userData.password) {
    userData.password = config.default.super_admin_pass as string;
  }

  // Hash the password before saving
  userData.password = await hashPassword(userData.password);
  userData.role = UserRole.SUPER_ADMIN;

  try {
    // Step 1: Generate a unique super admin ID
    const superAdminId = await generateSuperAdminId();
    superAdminData.superAdminId = superAdminId;
    console.log('superAdminId: ', superAdminId);

    // Step 2: Create Super Admin first to ensure the superAdminId exists
    const newSuperAdmin = await prisma.super_Admin.create({
      data: {
        ...superAdminData,
      },
    });

    // Step 3: Now create the User with the new superAdminId
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        userId: newSuperAdmin.superAdminId, // Set userId to match superAdminId
        superAdminId: newSuperAdmin.superAdminId, // Link to the newly created Admin
      },
    });

    console.log('Admin created:', newSuperAdmin);
    console.log('User created:', newUser);

    return newUser;
  } catch (error) {
    console.error('Error during user creation:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create user profile'
    );
  }
};

// Sample function to handle an event and create a Super Admin and User
const createSuperAdminFromEvent = async (e: SuperAdminCreatedEvent) => {
  const superAdminData: Partial<Super_Admin> = {
    id: e.id,
    superAdminId: e.superAdminId,
    firstName: e.firstName,
    lastName: e.lastName,
    middleName: e.middleName,
    email: e.email,
    profileImage: e.profileImage,
    contact: e.contact,
    gender: e.gender as Gender,
  };

  const userData: Partial<User> = {
    userId: e.superAdminId,
    password: config.default.super_admin_pass as string,
    role: UserRole.SUPER_ADMIN,
  };

  const data = await insertSuperAdminIntoDB(
    superAdminData as Super_Admin,
    userData as User
  );
  console.log('Result:', data);
};

// Sample function to update super admin from an event
const updateSuperAdminFromEvent = async (
  e: SuperAdminUpdatedEvent
): Promise<void> => {
  const isExist = await prisma.super_Admin.findFirst({
    where: {
      superAdminId: e.superAdminId,
    },
  });

  if (!isExist) {
    await createSuperAdminFromEvent(e);
    return;
  } else {
    const superAdmin: Partial<Super_Admin> = {
      id: e.id,
      superAdminId: e.superAdminId,
      firstName: e.firstName,
      lastName: e.lastName,
      middleName: e.middleName,
      email: e.email,
      profileImage: e.profileImage,
      contact: e.contact,
      gender: e.gender as Gender,
    };
    await prisma.super_Admin.update({
      where: {
        superAdminId: e.superAdminId,
      },
      data: superAdmin as Super_Admin,
    });
  }
};

export const UserServices = {
  insertMemberIntoDB,
  createMemberFromEvent,
  updateMemberFromEvent,
  insertAdminIntoDB,
  createAdminFromEvent,
  updateAdminFromEvent,
  insertSuperAdminIntoDB,
  createSuperAdminFromEvent,
  updateSuperAdminFromEvent,
};
