import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/handleApiError';
import { jwtHelpers } from '../../../helpers/jwt';
import { prisma } from '../../../shared/prisma';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interfaces';
import { hashPassword, isPasswordMatch, isUserExist } from './auth.utils';

const loginUserHandler = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const user = await isUserExist(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  console.log('user information available ', user.password, password);
  const isPasswordValid = await isPasswordMatch(
    password,
    user.password as string
  );
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password mismatch!');
  }

  const { id: userId, email, needsPasswordChange } = user;

  // Create access and refresh tokens
  const accessToken = jwtHelpers.createToken(
    { id: userId, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id: userId, email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshTokenHandler = async (
  payload: string
): Promise<IRefreshTokenResponse> => {
  let verifiedToken;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      payload,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id: userId, email } = verifiedToken;
  const user = await isUserExist(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  const newAccessToken = jwtHelpers.createToken(
    { id: userId, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePasswordHandler = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const existingUser = await isUserExist(user?.id);
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  const isOldPasswordValid = await isPasswordMatch(
    oldPassword,
    existingUser.password!
  );
  if (!isOldPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  const isNewPasswordSame = await isPasswordMatch(
    newPassword,
    existingUser.password!
  );
  if (isNewPasswordSame) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'New password cannot be the same as the old password'
    );
  }

  // Hash the new password and update the user record
  const hashedNewPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user?.id },
    data: {
      password: hashedNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  });
};

export const AuthServices = {
  loginUserHandler,
  refreshTokenHandler,
  changePasswordHandler,
};
