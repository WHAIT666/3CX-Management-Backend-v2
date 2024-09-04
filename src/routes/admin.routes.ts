import express from 'express';
import { User } from '../models/user.model';
import { verifyToken } from '../middlewares/verifyToken'; // Authentication middleware

const router = express.Router();

// Route to get user statistics for the dashboard
router.get('/dashboard-stats', verifyToken, async (req, res) => {
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

export default router;
