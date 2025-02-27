import { UserRole } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

export const findLastMemberId = async (): Promise<string | undefined> => {
  const lastMember = await prisma.user.findFirst({
    where: {
      role: UserRole.MEMBER, // Correct usage with enum
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      memberId: true,
    },
  });

  return lastMember?.memberId ? lastMember?.memberId.substring(2) : undefined;
};

export const generateMemberId = async (): Promise<string> => {
  const currentId = (await findLastMemberId()) || '00000';
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `M-${incrementedId}`;

  return incrementedId;
};

export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.ADMIN, // Correct usage with enum
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      adminId: true,
    },
  });

  return lastAdmin?.adminId ? lastAdmin?.adminId.substring(2) : undefined;
};

export const generateAdminId = async (): Promise<string> => {
  const currentId = (await findLastAdminId()) || '00000';
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `A-${incrementedId}`;

  return incrementedId;
};

export const findLastSuperAdminId = async (): Promise<string | undefined> => {
  const lastSuperAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN, // Correct usage with enum
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      superAdminId: true,
    },
  });

  return lastSuperAdmin?.superAdminId
    ? lastSuperAdmin?.superAdminId.substring(3)
    : undefined;
};

export const generateSuperAdminId = async (): Promise<string> => {
  const currentId = (await findLastSuperAdminId()) || '00000';
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `SA-${incrementedId}`;

  return incrementedId;
};
