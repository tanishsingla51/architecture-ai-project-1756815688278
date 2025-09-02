import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { PullRequest } from '../models/pullRequest.model.js';

// Note: This is a simplified controller. A real implementation would involve
// complex logic with Git operations (checking for merge conflicts, etc.).

// --- Create a new Pull Request ---
const createPullRequest = asyncHandler(async (req, res) => {
    const { title, description, fromBranch, toBranch } = req.body;
    // req.repository is attached by the getRepoContext middleware from issue controller
    const repositoryId = req.repository._id; 
    const authorId = req.user._id;

    if (!title || !description || !fromBranch || !toBranch) {
        throw new ApiError(400, "Title, description, fromBranch, and toBranch are required.");
    }
    if (fromBranch === toBranch) {
        throw new ApiError(400, "Source and destination branches cannot be the same.");
    }

    const pr = await PullRequest.create({
        title,
        description,
        fromBranch,
        toBranch,
        repository: repositoryId,
        author: authorId,
    });

    return res.status(201).json(new ApiResponse(201, pr, "Pull Request created successfully"));
});

// --- Get all Pull Requests for a repository ---
const getPullRequestsForRepo = asyncHandler(async (req, res) => {
    const pullRequests = await PullRequest.find({ repository: req.repository._id })
        .populate('author', 'username')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, pullRequests, "Pull Requests fetched successfully"));
});

// --- Update PR status (e.g., close or merge) ---
const updatePullRequestStatus = asyncHandler(async (req, res) => {
    const { prId } = req.params;
    const { status } = req.body; // Expecting 'closed' or 'merged'

    if (!['closed', 'merged'].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'closed' or 'merged'.");
    }

    // A real 'merged' status would trigger a Git merge operation.
    // Here we just update the DB.

    const pr = await PullRequest.findOneAndUpdate(
        { _id: prId, repository: req.repository._id },
        { $set: { status } },
        { new: true }
    );

    if (!pr) {
        throw new ApiError(404, "Pull Request not found.");
    }

    return res.status(200).json(new ApiResponse(200, pr, `Pull Request has been ${status}.`));
});

export { createPullRequest, getPullRequestsForRepo, updatePullRequestStatus };
