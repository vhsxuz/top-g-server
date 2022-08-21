import { Router } from 'express';
import { createThread, getThread, getThreadsList, postComment } from '../controllers/thread.controllers';

const router = Router();

router.route('/').post(createThread);
router.route('/').get(getThreadsList);
router.route('/:threadId').post(postComment);
router.route('/:threadId').get(getThread);

export default router;