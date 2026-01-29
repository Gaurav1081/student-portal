const express = require('express');
const User = require('../models/User');
const Batch = require('../models/Batch');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user (Admin only)
// @access  Private/Admin
router.post('/register', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, batch } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'learner',
      batch: batch || null,
    });

    // If batch is provided and user is a learner, add to batch's students array
    if (batch && role === 'learner') {
      const batchDoc = await Batch.findById(batch);
      if (batchDoc && !batchDoc.students.includes(user._id)) {
        batchDoc.students.push(user._id);
        await batchDoc.save();
      }
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      batch: user.batch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('batch');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/trainers
// @desc    Get all trainers
// @access  Private/Admin
router.get('/trainers', protect, adminOnly, async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/learners
// @desc    Get all learners
// @access  Private/Admin
router.get('/learners', protect, adminOnly, async (req, res) => {
  try {
    const learners = await User.find({ role: 'learner' }).select('-password').populate('batch');
    res.json(learners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('batch');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only admin or the user themselves can update
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const { name, email, phone, subject, batch, profileImage } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.subject = subject || user.subject;
    user.batch = batch || user.batch;
    user.profileImage = profileImage || user.profileImage;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      subject: updatedUser.subject,
      batch: updatedUser.batch,
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/:id/assign-batch
// @desc    Assign student to batch
// @access  Private/Admin
router.put('/:id/assign-batch', protect, adminOnly, async (req, res) => {
  try {
    const { batchId } = req.body;
    
    const user = await User.findById(req.params.id);
    const batch = await Batch.findById(batchId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Update user's batch
    user.batch = batchId;
    await user.save();

    // Add user to batch's students array if not already there
    if (!batch.students.includes(user._id)) {
      batch.students.push(user._id);
      await batch.save();
    }

    res.json({ message: 'Student assigned to batch successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;