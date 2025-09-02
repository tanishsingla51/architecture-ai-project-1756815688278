import mongoose from 'mongoose';

const pullRequestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['open', 'closed', 'merged'],
            default: 'open',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        repository: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository',
            required: true,
        },
        fromBranch: {
            type: String,
            required: true,
        },
        toBranch: {
            type: String,
            required: true,
        },
        reviewers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

export const PullRequest = mongoose.model('PullRequest', pullRequestSchema);
