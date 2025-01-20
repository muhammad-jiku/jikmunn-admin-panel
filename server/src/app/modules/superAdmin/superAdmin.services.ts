import { Prisma, Super_Admin } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/handleApiError';
import { paginationHelpers } from '../../../helpers/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { superAdminSearchableFields } from './superAdmin.constants';
import { ISuperAdminFilterRequest } from './superAdmin.interfaces';

// Get all super admins with filters and pagination
const getAllFromDB = async (
  filters: ISuperAdminFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Super_Admin[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: Prisma.Super_AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: superAdminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  const whereConditions: Prisma.Super_AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const superAdmins = await prisma.super_Admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : undefined,
  });

  const total = await prisma.super_Admin.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: superAdmins,
  };
};

// Get a single super admin by ID
const getByIdFromDB = async (id: string): Promise<Super_Admin | null> => {
  const result = await prisma.super_Admin.findUnique({
    where: { superAdminId: id },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry, the super admin does not exist!'
    );
  }

  return result;
};

// Update a super admin by ID
const updateOneInDB = async (
  id: string,
  payload: Prisma.Super_AdminUpdateInput
): Promise<Super_Admin | null> => {
  const result = await prisma.super_Admin.update({
    where: { superAdminId: id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, 'Sorry, failed to update!');
  }

  return result;
};

// Delete a super admin by ID
const deleteByIdFromDB = async (id: string): Promise<Super_Admin | null> => {
  const superAdmin = await prisma.super_Admin.findUnique({
    where: { superAdminId: id },
    include: {
      user: true, // Include the related user
    },
  });

  if (!superAdmin) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry, the super admin does not exist!'
    );
  }

  console.log('super admin', superAdmin);
  console.log('user', superAdmin.user);
  // Step 1: Delete the User record associated with the Super Admin
  if (superAdmin.user) {
    await prisma.user.delete({
      where: { userId: superAdmin.user.userId },
    });
  }

  // Step 2: Delete the Super Admin record
  const result = await prisma.super_Admin.delete({
    where: {
      superAdminId: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, failed to delete!');
  }

  return result;
};

export const SuperAdminServices = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
