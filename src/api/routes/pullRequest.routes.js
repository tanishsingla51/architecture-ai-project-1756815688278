import { Router } from 'express';
import { 
    createPullRequest, 
    getPullRequestsForRepo,
    updatePullRequestStatus 
} from '../controllers/pullRequest.controller.js';
import { getRepoContext } from '../controllers/issue.controller.js'; // Re-use the repo context middleware
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

// Apply middleware to get repo context and require authentication
router.use(verifyJWT, getRepoContext);

router.route('/')
    .post(createPullRequest)
    .get(getPullRequestsForRepo);
    
router.route('/:prId/status')
    .patch(updatePullRequestStatus); // e.g., to merge or close

export default router;
