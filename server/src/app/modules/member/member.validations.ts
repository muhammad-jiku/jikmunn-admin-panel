import { Gender } from '@prisma/client';
import { z } from 'zod';

const updateMember = z.object({
  body: z
    .object({
      // memberId: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      middleName: z.string().optional(),
      profileImage: z.string().optional(),
      // email: z.string().optional(),
      // contactNo: z.string().optional(),
      gender: z.enum(Object.values(Gender) as [string, ...string[]]).optional(),
      provider: z.string().optional(),
      country: z.string().optional(),
      currency: z.string().optional(),
    })
    .strict()
    .optional(),
});

export const MemberValidations = {
  updateMember,
};
