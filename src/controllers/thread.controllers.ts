import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, AuthenticationError } from '../errors';

const prisma = new PrismaClient();

export const createThread = async (req: Request, res: Response, next: NextFunction) => {
  const { title, question, user } = req.body;
  const userId = user.id;
  if (!title || !userId) {
    throw new BadRequestError('Data not complete');
  }
  const thread = await prisma.thread.create({
    data: {
      userId: userId,
      title: title,
      question: question,
    }
  });
  return res.status(200).json({
    success: true,
    msg: 'Thread Created',
    threadId: thread.id,
  });
}

export const getThreadsList = async (req: Request, res: Response, next: NextFunction) => {
  const threadList = await prisma.thread.findMany({});
  return res.status(200).json({
    success: true,
    msg: 'Gym List Request Success',
    threadsList: threadList,
  });
}

export const getThread = async (req: Request, res: Response, next: NextFunction) => {
  const { threadId } = req.params;
  if (!threadId) {
    throw new BadRequestError('Data not complete');
  }
  const thread = await prisma.thread.findFirst({
    where: {
      id: threadId
    },
    include: {
      comments: {
        include: {
          user: true
        }
      }
    }
  });
  return res.status(200).json({
    success: true,
    msg: 'Find Thread success',
    thread: thread,
  });
}

export const postComment = async (req: Request, res: Response, next: NextFunction) => {
  const { threadId } = req.params;
  const { content, user } = req.body;
  const userId = user.id;
  const comment = await prisma.comment.create({
    data: {
      content: content,
      threadId: threadId,
      userId: userId
    }
  });
  return res.status(200).json({
    success: true,
    msg: 'Comment Posted',
    comment: comment,
  });
}