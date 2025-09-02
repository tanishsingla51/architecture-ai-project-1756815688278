import { Router } from 'express';
import {
    createRepository,
    getRepository,
    updateRepository,
    deleteRepository,
} from '../controllers/repository.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import issueRouter from './issue.routes.js';
import pullRequestRouter from './pullRequest.routes.js';

const router = Router();

// Protected route to create a new repository
router.route('/').post(verifyJWT, createRepository);

// Routes for a specific repository
router.route('/:ownerUsername/:repoName')
    .get(getRepository) // Can be public or private, logic is in controller
    .patch(verifyJWT, updateRepository) // Must be owner
    .delete(verifyJWT, deleteRepository); // Must be owner

// --- Nested Routes for Issues and Pull Requests ---

// Pass control to the issue router for /:ownerUsername/:repoName/issues
router.use('/:ownerUsername/:repoName/issues', issueRouter);

// Pass control to the pull request router for /:ownerUsername/:repoName/pulls
router.use('/:ownerUsername/:repoName/pulls', pullRequestRouter);


export default router;
