import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Issue } from '../models/issue.model.js';
import { Repository } from '../models/repository.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

// Middleware to get repository context for issue routes
const getRepoContext = asyncHandler(async (req, res, next) => {
    const { ownerUsername, repoName } = req.params;
    
    const owner = await User.findOne({ username: ownerUsername });
    if (!owner) throw new ApiError(404, "Repository owner not found");

    const repo = await Repository.findOne({ name: repoName, owner: owner._id });
    if (!repo) throw new ApiError(404, "Repository not found");

    req.repository = repo;
    next();
});

// --- Create a new issue ---
const createIssue = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const repositoryId = req.repository._id;
    const authorId = req.user._id;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required for an issue.");
    }

    const issue = await Issue.create({
        title,
        description,
        repository: repositoryId,
        author: authorId,
    });

    return res.status(201).json(new ApiResponse(201, issue, "Issue created successfully"));
});

// --- Get all issues for a repository ---
const getIssuesForRepo = asyncHandler(async (req, res) => {
    const issues = await Issue.find({ repository: req.repository._id })
        .populate('author', 'username')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, issues, "Issues fetched successfully"));
});

// --- Get a single issue ---
const getIssue = asyncHandler(async (req, res) => {
    const { issueId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        throw new ApiError(400, "Invalid issue ID format");
    }
    
    const issue = await Issue.findOne({ _id: issueId, repository: req.repository._id })
        .populate('author', 'username')
        .populate('assignees', 'username');

    if (!issue) {
        throw new ApiError(404, "Issue not found in this repository");
    }

    return res.status(200).json(new ApiResponse(200, issue, "Issue fetched successfully"));
});

// --- Update an issue (e.g., change status, title, description) ---
const updateIssue = asyncHandler(async (req, res) => {
    const { issueId } = req.params;
    const { title, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        throw new ApiError(400, "Invalid issue ID format");
    }

    const issue = await Issue.findOneAndUpdate(
        { _id: issueId, repository: req.repository._id },
        { $set: { title, description, status } },
        { new: true, runValidators: true }
    );

    if (!issue) {
        throw new ApiError(404, "Issue not found or you don't have permission to update it.");
    }

    return res.status(200).json(new ApiResponse(200, issue, "Issue updated successfully"));
});

export { getRepoContext, createIssue, getIssuesForRepo, getIssue, updateIssue };
