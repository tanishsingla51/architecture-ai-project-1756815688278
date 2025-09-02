import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
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
            enum: ['open', 'closed', 'in_progress'],
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
        assignees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        labels: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    { timestamps: true }
);

export const Issue = mongoose.model('Issue', issueSchema);
