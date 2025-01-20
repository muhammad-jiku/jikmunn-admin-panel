import { Admin, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/handleApiError';
import { paginationHelpers } from '../../../helpers/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { adminSearchableFields } from './admin.constants';
import { IAdminFilterRequest } from './admin.interfaces';

// Get all admins with filters and pagination
const getAllFromDB = async (
  filters: IAdminFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Admin[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const admins = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : undefined,
  });

  const total = await prisma.admin.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: admins,
  };
};

// Get a single admin by ID
const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: { adminId: id },
  });
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry, the admin does not exist!'
    );
  }

  return result;
};

// Update an admin by ID
const updateOneInDB = async (
  id: string,
  payload: Prisma.AdminUpdateInput
): Promise<Admin | null> => {
  const result = await prisma.admin.update({
    where: { adminId: id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, 'Sorry, failed to update!');
  }

  return result;
};

// Delete an admin by ID
const deleteByIdFromDB = async (id: string): Promise<Admin | null> => {
  const admin = await prisma.admin.findUnique({
    where: { adminId: id },
    include: {
      user: true, // Include the related user
    },
  });

  if (!admin) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry, the admin does not exist!'
    );
  }

  console.log('admin', admin);
  console.log('user', admin.user);
  // Step 1: Delete the User record associated with the Admin
  if (admin.user) {
    await prisma.user.delete({
      where: { userId: admin.user.userId },
    });
  }

  // Step 2: Delete the Admin record
  const result = await prisma.admin.delete({
    where: {
      adminId: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, failed to delete!');
  }

  return result;
};

export const AdminServices = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
