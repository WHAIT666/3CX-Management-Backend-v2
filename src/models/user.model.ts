import mongoose, { Document, Schema, Model, model } from "mongoose";

// Define an interface representing a document in MongoDB
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    lastLogin?: Date;
    isVerified: boolean;
    role: string;
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
}

// Define the schema corresponding to the document interface
const userSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
        resetPasswordToken: {
            type: String,
            default: undefined,
        },
        resetPasswordExpiresAt: {
            type: Date,
            default: undefined,
        },
        verificationToken: {
            type: String,
            default: undefined,
        },
        verificationTokenExpiresAt: {
            type: Date,
            default: undefined,
        },
    },
    { timestamps: true }
);

// Create and export the model
export const User: Model<IUser> = model<IUser>("User", userSchema);
