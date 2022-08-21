import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, AuthenticationError } from '../errors';
import hash from '../utils/hash.utils';
import { generateToken } from '../utils/token.utils';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError('Credentials not complete');
  }
  const checkUser = await prisma.user.findFirst({
    where: {
      username: username,
    }
  });
  if (checkUser) {
    throw new BadRequestError("Username already exsists");
  }
  const passwordHash = hash(password);
  const newUser = await prisma.user.create({
    data: {
      username: username,
      passwordHash: passwordHash,
    }
  });
  return res.status(200).json({
    success: true,
    msg: 'Registration Success',
    user: newUser,
  });
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError('Credentials not complete');
  }
  const passwordHash = hash(password);
  const loginUser = await prisma.user.findFirst({
    where: {
      AND: [
        {
          username: username,
        },
        {
          passwordHash: passwordHash,
        }
      ]
    }
  });
  if (!loginUser) {
    throw new AuthenticationError('Username or Password is false');
  }
  const { id } = loginUser;
  const token = await generateToken(id, passwordHash);
  return res.status(200).json({
    success: true,
    msg: 'Login Success',
    token: token,
  });
}