import mongoose from 'mongoose';

// A simplified model to represent commits. In a real system, this would
// likely be derived from actual Git data.
const commitSchema = new mongoose.Schema(
    {
        hash: {
            type: String,
            required: true,
            unique: true, // Simplified assumption
        },
        message: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to a user in our system
            required: true,
        },
        repository: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository',
            required: true,
        },
        branch: {
            type: String,
            required: true,
            default: 'main',
        },
    },
    { timestamps: true }
);

export const Commit = mongoose.model('Commit', commitSchema);
