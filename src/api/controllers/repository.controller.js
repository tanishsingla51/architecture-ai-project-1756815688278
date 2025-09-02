import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Repository } from '../models/repository.model.js';
import { User } from '../models/user.model.js';

// --- Create a new repository ---
const createRepository = asyncHandler(async (req, res) => {
    const { name, description, isPublic } = req.body;
    const ownerId = req.user._id;

    if (!name) {
        throw new ApiError(400, "Repository name is required");
    }

    // Check if repo with same name already exists for this user
    const existingRepo = await Repository.findOne({ name, owner: ownerId });
    if (existingRepo) {
        throw new ApiError(409, `Repository with name '${name}' already exists for this user.`);
    }

    const repo = await Repository.create({
        name,
        description,
        isPublic,
        owner: ownerId,
    });

    return res.status(201).json(new ApiResponse(201, repo, "Repository created successfully"));
});

// --- Get a single repository ---
const getRepository = asyncHandler(async (req, res) => {
    const { ownerUsername, repoName } = req.params;
    
    const owner = await User.findOne({ username: ownerUsername });
    if (!owner) {
        throw new ApiError(404, "Owner not found");
    }

    const repo = await Repository.findOne({ name: repoName, owner: owner._id }).populate("owner", "username fullName");

    if (!repo) {
        throw new ApiError(404, "Repository not found");
    }
    
    // In a real app, you would add logic here to check if the repo is public
    // or if the requesting user has access (is owner or collaborator).

    return res.status(200).json(new ApiResponse(200, repo, "Repository fetched successfully"));
});

// --- Update a repository ---
const updateRepository = asyncHandler(async (req, res) => {
    const { ownerUsername, repoName } = req.params;
    const { description, isPublic } = req.body;
    
    const owner = await User.findOne({ username: ownerUsername });
    if (!owner) throw new ApiError(404, "Owner not found");

    // Ensure the requester is the owner
    if (req.user._id.toString() !== owner._id.toString()) {
        throw new ApiError(403, "Forbidden: You are not the owner of this repository");
    }

    const repo = await Repository.findOneAndUpdate(
        { name: repoName, owner: owner._id },
        { $set: { description, isPublic } },
        { new: true }
    );

    if (!repo) {
        throw new ApiError(404, "Repository not found");
    }

    return res.status(200).json(new ApiResponse(200, repo, "Repository updated successfully"));
});

// --- Delete a repository ---
const deleteRepository = asyncHandler(async (req, res) => {
    const { ownerUsername, repoName } = req.params;
    
    const owner = await User.findOne({ username: ownerUsername });
    if (!owner) throw new ApiError(404, "Owner not found");

    if (req.user._id.toString() !== owner._id.toString()) {
        throw new ApiError(403, "Forbidden: You are not the owner of this repository");
    }

    const result = await Repository.deleteOne({ name: repoName, owner: owner._id });

    if (result.deletedCount === 0) {
        throw new ApiError(404, "Repository not found");
    }

    // In a real app, you would also delete associated issues, PRs, etc.

    return res.status(200).json(new ApiResponse(200, {}, "Repository deleted successfully"));
});


export { createRepository, getRepository, updateRepository, deleteRepository };
