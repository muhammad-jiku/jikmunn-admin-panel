import { Gender } from '@prisma/client';
import { z } from 'zod';

const createMember = z.object({
  body: z
    .object({
      member: z
        .object({
          // name: z
          //   .object({
          firstName: z.string({
            required_error: 'First name is required',
          }),
          lastName: z.string({
            required_error: 'Last name is required',
          }),
          middleName: z.string().optional(),
          // })
          // .strict(),
          profileImage: z.string().optional(),
          email: z
            .string({
              required_error: 'Email is required',
            })
            .email('Invalid email format'),
          contact: z.string({
            required_error: 'Contact number is required',
          }),
          gender: z.enum(Object.values(Gender) as [string, ...string[]], {
            required_error: 'Gender is required',
          }),
          provider: z.string().optional(),
          country: z.string().optional(),
          currency: z.string().default('USD'),
        })
        .strict(),
    })
    .strict(),
});

const createAdmin = z.object({
  body: z
    .object({
      admin: z
        .object({
          // name: z
          //   .object({
          firstName: z.string({
            required_error: 'First name is required',
          }),
          lastName: z.string({
            required_error: 'Last name is required',
          }),
          middleName: z.string().optional(),
          // })
          // .strict(),
          profileImage: z.string().optional(),
          email: z
            .string({
              required_error: 'Email is required',
            })
            .email('Invalid email format'),
          contact: z.string({
            required_error: 'Contact number is required',
          }),
          gender: z.enum(Object.values(Gender) as [string, ...string[]], {
            required_error: 'Gender is required',
          }),
        })
        .strict(),
    })
    .strict(),
});

const createSuperAdmin = z.object({
  body: z
    .object({
      superAdmin: z
        .object({
          // name: z
          //   .object({
          firstName: z.string({
            required_error: 'First name is required',
          }),
          lastName: z.string({
            required_error: 'Last name is required',
          }),
          middleName: z.string().optional(),
          // })
          // .strict(),
          profileImage: z.string().optional(),
          email: z
            .string({
              required_error: 'Email is required',
            })
            .email('Invalid email format'),
          contact: z.string({
            required_error: 'Contact number is required',
          }),
          gender: z.enum(Object.values(Gender) as [string, ...string[]], {
            required_error: 'Gender is required',
          }),
        })
        .strict(),
    })
    .strict(),
});

export const UserValidations = {
  createMember,
  createAdmin,
  createSuperAdmin,
};
