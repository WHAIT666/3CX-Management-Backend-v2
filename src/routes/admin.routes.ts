import express from 'express';
import bcryptjs from 'bcryptjs';
import { User } from '../models/user.model';
import { verifyToken } from '../middlewares/verifyToken'; // Authentication middleware
import { requireRole } from '../middlewares/requireRole'; // Role-based access control middleware

const router = express.Router();

// Route to get user statistics for the dashboard (Admin only)
router.get('/dashboard-stats', verifyToken, requireRole('Admin'), async (req, res) => {
  try {
    // Fetch user statistics from the database
    const totalUsers = await User.countDocuments({});
    const adminUsers = await User.countDocuments({ role: 'Admin' });
    const regularUsers = await User.countDocuments({ role: 'User' });

    // Send the data as JSON
    res.status(200).json({
      totalUsers,
      adminUsers,
      regularUsers,
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to update a user's role (Admin only)
router.put('/users/:userId/role', verifyToken, requireRole('Admin'), async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Only allow "Admin" and "User" roles
  if (!['Admin', 'User'].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to delete a user (Admin only)
router.delete('/users/:userId', verifyToken, requireRole('Admin'), async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to create a new user by Admin
router.post('/users', verifyToken, requireRole('Admin'), async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Only allow "Admin" and "User" roles
  if (!['Admin', 'User'].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Fetch all users
router.get('/users', verifyToken, requireRole('Admin'), async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt'); // Fetch user fields you need
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
