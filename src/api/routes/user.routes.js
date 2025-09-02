import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getCurrentUser,
    getUserRepositories,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Protected routes
router.route('/me').get(verifyJWT, getCurrentUser);

// Public profile routes
router.route('/:username/repos').get(getUserRepositories);


export default router;
