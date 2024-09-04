import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../Nodemailer/emails";
import { User, IUser } from "../models/user.model";

// Export the interface for Authenticated Request
export interface AuthenticatedRequest extends Request {
    userId?: string;
}

// Signup Controller
export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, role } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            console.log("Signup failed: User already exists");
            res.status(400).json({ success: false, message: "User already exists" });
            return;
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            role: role || "User",  // Default role to "User" if not provided
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        await user.save();

        console.log("User created successfully:", user);

        // Generate JWT and set it as a cookie
        generateTokenAndSetCookie(res, (user._id as string).toString());

        await sendVerificationEmail(email as string, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user.toObject(),
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in signup:", (error as Error).message);
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

// Email Verification Controller
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            console.log("Verification failed: Invalid or expired verification code");
            res.status(400).json({ success: false, message: "Invalid or expired verification code" });
            return;
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        console.log("Email verified successfully for user:", user);

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user.toObject(),
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in verifyEmail:", (error as Error).message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Login Controller
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login failed: Invalid credentials");
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Login failed: Invalid credentials");
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }

        console.log("User authenticated successfully, generating token...");
        generateTokenAndSetCookie(res, (user._id as string).toString());

        user.lastLogin = new Date();
        await user.save();

        console.log("User logged in successfully:", user);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user.toObject(),
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in login:", (error as Error).message);
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

// Logout Controller
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token");
    console.log("User logged out successfully");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Forgot Password Controller
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Forgot password failed: User not found");
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        console.log("Password reset token generated and email sent for user:", user);

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Error in forgotPassword:", (error as Error).message);
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

// Reset Password Controller
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            console.log("Reset password failed: Invalid or expired reset token");
            res.status(400).json({ success: false, message: "Invalid or expired reset token" });
            return;
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        console.log("Password reset successful for user:", user);

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", (error as Error).message);
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

// Check Auth Controller
export const checkAuth = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            console.log("Check auth failed: User not found");
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }

        console.log("User authenticated and found:", user);

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error in checkAuth:", (error as Error).message);
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};
