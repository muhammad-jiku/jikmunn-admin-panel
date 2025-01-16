import { Member, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { memberSearchableFields } from './member.constants';
import { IMemberFilterRequest } from './member.interfaces';

const getAllFromDB = async (
  filters: IMemberFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Member[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: memberSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.MemberWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.member.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.member.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Member | null> => {
  const result = await prisma.member.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Member>
): Promise<Member> => {
  const result = await prisma.member.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Member> => {
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      user: true, // Include the related user
    },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  // Step 1: Delete the User record associated with the Member
  if (member.user) {
    await prisma.user.delete({
      where: { id: member.user.id },
    });
  }

  // Step 2: Delete the Member record
  const result = await prisma.member.delete({
    where: {
      id,
    },
  });

  return result;
};

export const MemberServices = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
