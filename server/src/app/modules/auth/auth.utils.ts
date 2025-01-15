import bcrypt from 'bcrypt';
import config from '../../../config';
import { prisma } from '../../../shared/prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
}

export async function isUserExist(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
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
