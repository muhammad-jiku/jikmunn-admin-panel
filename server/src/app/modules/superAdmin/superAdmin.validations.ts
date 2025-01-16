import { Gender } from '@prisma/client';
import { z } from 'zod';

const updateSuperAdmin = z.object({
  body: z
    .object({
      // superAdminId: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      middleName: z.string().optional(),
      profileImage: z.string().optional(),
      // email: z.string().optional(),
      // contact: z.string().optional(),
      gender: z.enum(Object.values(Gender) as [string, ...string[]]).optional(),
    })
    .strict()
    .optional(),
});

export const SuperAdminValidations = {
  updateSuperAdmin,
};
