import { Router } from 'express';
import {
    getRepoContext,
    createIssue,
    getIssuesForRepo,
    getIssue,
    updateIssue,
} from '../controllers/issue.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

// The 'mergeParams: true' option is crucial for accessing params from the parent router (e.g., :ownerUsername)
const router = Router({ mergeParams: true });

// Apply the repository context middleware to all routes in this file
router.use(getRepoContext);

router.route('/')
    .post(verifyJWT, createIssue) // Must be authenticated to create an issue
    .get(getIssuesForRepo); // Anyone can view issues (for public repos)

router.route('/:issueId')
    .get(getIssue)
    .patch(verifyJWT, updateIssue); // Must be authenticated to update

export default router;
