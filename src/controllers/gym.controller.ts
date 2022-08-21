import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, AuthenticationError, CustomError } from '../errors';

const prisma = new PrismaClient();

export const gymsList = async (req: Request, res: Response, next: NextFunction) => {
  const gymList = await prisma.gym.findMany({});
  return res.status(200).json({
    success: true,
    msg: 'Gym List Request Success',
    gymList: gymList,
  });
}

export const gymDetails = async (req: Request, res: Response, next: NextFunction) => {
  const gymId = req.params.id
  if (!gymId || typeof (gymId) != 'string') {
    throw new BadRequestError("Gym ID not valid");
  }
  const gymInfo = await prisma.gym.findUnique({
    where: {
      id: gymId,
    }
  });
  return res.status(200).json({
    success: true,
    msg: 'Gym List Request Success',
    gymInfo: gymInfo,
  });
}

export const checkIn = async (req: Request, res: Response, next: NextFunction) => {
  const gymId = req.params.id;
  const opt = req.body.opt;
  let num;
  if (opt == 'checkIn') {
    num = 1;
  }
  else {
    num = -1;
  }
  const capacity = await prisma.gym.findFirst({
    where: {
      id: gymId,
    },
    select: {
      currentCapacity: true,
      maxCapacity: true,
    }
  });
  if (!capacity) {
    throw new CustomError('Capacity not found');
  }
  if (capacity?.currentCapacity >= capacity?.maxCapacity) {
    throw new CustomError('Capacity is full');
  }
  await prisma.gym.update({
    where: {
      id: gymId,
    },
    data: {
      currentCapacity: capacity.currentCapacity + num,
    }
  });
  return res.status(200).json({
    success: true,
    msg: 'Check In Success',
  });
}