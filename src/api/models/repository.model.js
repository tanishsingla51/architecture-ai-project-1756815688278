import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        // A repository name must be unique for a given owner
    },
    { timestamps: true }
);

// Create a compound index to ensure a user cannot have two repos with the same name
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

export const Repository = mongoose.model('Repository', repositorySchema);
