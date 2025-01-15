import { z } from 'zod';

const loginUserHandler = z.object({
  body: z
    .object({
      id: z.number({
        required_error: 'User id is required',
      }),
      password: z.string({
        required_error: 'Password is required',
      }),
    })
    .strict(),
});

const refreshTokenHandler = z.object({
  cookies: z
    .object({
      refreshToken: z.string({
        required_error: 'Refresh Token is required',
      }),
    })
    .strict(),
});

const changePasswordHandler = z.object({
  body: z
    .object({
      oldPassword: z.string({
        required_error: 'Old Password is required',
      }),
      newPassword: z.string({
        required_error: 'New Password is required',
      }),
    })
    .strict(),
});

export const AuthValidations = {
  loginUserHandler,
  refreshTokenHandler,
  changePasswordHandler,
};
