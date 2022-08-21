import { Router } from 'express';
import { gymsList, gymDetails, checkIn } from '../controllers/gym.controller';

const router = Router();

router.route('/').get(gymsList);
router.route('/:id').get(gymDetails);
router.route('/:id').patch(checkIn);

export default router;