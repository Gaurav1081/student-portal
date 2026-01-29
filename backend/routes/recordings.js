const express = require('express');
const Class = require('../models/Class');
const { protect, trainerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/recordings
// @desc    Get all classes with recordings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = { recordingLink: { $ne: '' } };

    // If learner, only show recordings for their batch
    if (req.user.role === 'learner' && req.user.batch) {
      query.batch = req.user.batch;
    }

    // If trainer, only show their class recordings
    if (req.user.role === 'trainer') {
      query.trainer = req.user._id;
    }

    const recordings = await Class.find(query)
      .populate('batch', 'name subject')
      .populate('trainer', 'name email')
      .sort({ date: -1 });

    res.json(recordings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/recordings/:classId
// @desc    Upload recording link to a class
// @access  Private/Trainer or Admin
router.put('/:classId', protect, trainerOrAdmin, async (req, res) => {
  try {
    const { recordingLink } = req.body;

    const classItem = await Class.findById(req.params.classId);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Trainers can only upload recordings for their own classes
    if (req.user.role === 'trainer' && classItem.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this class' });
    }

    classItem.recordingLink = recordingLink;
    classItem.status = 'completed';

    const updatedClass = await classItem.save();

    const populatedClass = await Class.findById(updatedClass._id)
      .populate('batch', 'name subject')
      .populate('trainer', 'name email');

    res.json(populatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/recordings/:classId
// @desc    Remove recording link from a class
// @access  Private/Trainer or Admin
router.delete('/:classId', protect, trainerOrAdmin, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.classId);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Trainers can only remove recordings from their own classes
    if (req.user.role === 'trainer' && classItem.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this class' });
    }

    classItem.recordingLink = '';

    const updatedClass = await classItem.save();

    res.json({ message: 'Recording link removed', class: updatedClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;