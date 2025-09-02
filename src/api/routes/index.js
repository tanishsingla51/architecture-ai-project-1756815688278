import { Router } from 'express';
import userRouter from './user.routes.js';
import repositoryRouter from './repository.routes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/repos', repositoryRouter);

export default router;
