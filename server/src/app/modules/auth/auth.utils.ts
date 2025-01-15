import bcrypt from 'bcrypt';
import config from '../../../config';
import { prisma } from '../../../shared/prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
}

export async function isUserExist(id: string) {
  const user = await prisma.user.findUnique({
    where: { userId: id },
    select: {
      id: true,
      userId: true,
      role: true,
      password: true,
      needsPasswordChange: true,
    },
  });

  return user;
}

export async function isPasswordMatch(
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  console.log('Comparing passwords:', { givenPassword, savedPassword }); // Debugging logs
  return bcrypt.compare(givenPassword, savedPassword);
}
