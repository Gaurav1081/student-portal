const express = require('express');
const Class = require('../models/Class');
const Batch = require('../models/Batch');
const { protect, trainerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/classes
// @desc    Get all classes (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Filter by batch if provided
    if (req.query.batch) {
      query.batch = req.query.batch;
    }

    // Filter by trainer if provided
    if (req.query.trainer) {
      query.trainer = req.query.trainer;
    }

    // Filter by date if provided
    if (req.query.date) {
      const startOfDay = new Date(req.query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.query.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const classes = await Class.find(query)
      .populate('batch', 'name subject')
      .populate('trainer', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/classes/my-classes
// @desc    Get classes for logged-in user (trainer sees their classes, learner sees batch classes)
// @access  Private
router.get('/my-classes', protect, async (req, res) => {
  try {
    let classes;

    if (req.user.role === 'trainer') {
      // Trainers see only their classes
      classes = await Class.find({ trainer: req.user._id })
        .populate('batch', 'name subject')
        .populate('trainer', 'name email')
        .sort({ date: 1, startTime: 1 });
    } else if (req.user.role === 'learner') {
      // Learners see classes from ALL batches they're assigned to
      // Find all batches where this student is assigned
      const batches = await Batch.find({ students: req.user._id }).select('_id');
      
      if (batches.length === 0) {
        return res.json([]);
      }
      
      // Extract batch IDs
      const batchIds = batches.map(batch => batch._id);
      
      // Find all classes for those batches
      classes = await Class.find({ batch: { $in: batchIds } })
        .populate('batch', 'name subject')
        .populate('trainer', 'name email')
        .sort({ date: 1, startTime: 1 });
    } else if (req.user.role === 'admin') {
      // Admins see all classes
      classes = await Class.find({})
        .populate('batch', 'name subject')
        .populate('trainer', 'name email')
        .sort({ date: 1, startTime: 1 });
    }

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/classes/:id
// @desc    Get class by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('batch', 'name subject')
      .populate('trainer', 'name email');

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/classes
// @desc    Create a new class
// @access  Private/Trainer or Admin
router.post('/', protect, trainerOrAdmin, async (req, res) => {
  try {
    const { className, batch, trainer, date, startTime, endTime, teamsLink, description } = req.body;

    // If user is a trainer, they can only create classes for themselves
    const finalTrainer = req.user.role === 'trainer' ? req.user._id : trainer;

    const classItem = await Class.create({
      className,
      batch,
      trainer: finalTrainer,
      date,
      startTime,
      endTime,
      teamsLink,
      description,
    });

    const populatedClass = await Class.findById(classItem._id)
      .populate('batch', 'name subject')
      .populate('trainer', 'name email');

    res.status(201).json(populatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/classes/:id
// @desc    Update a class
// @access  Private/Trainer or Admin
router.put('/:id', protect, trainerOrAdmin, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Trainers can only update their own classes, admins can update any
    if (req.user.role === 'trainer' && classItem.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this class' });
    }

    const { className, batch, date, startTime, endTime, teamsLink, recordingLink, status, description } = req.body;

    classItem.className = className || classItem.className;
    classItem.batch = batch || classItem.batch;
    classItem.date = date || classItem.date;
    classItem.startTime = startTime || classItem.startTime;
    classItem.endTime = endTime || classItem.endTime;
    classItem.teamsLink = teamsLink || classItem.teamsLink;
    classItem.recordingLink = recordingLink !== undefined ? recordingLink : classItem.recordingLink;
    classItem.status = status || classItem.status;
    classItem.description = description !== undefined ? description : classItem.description;

    const updatedClass = await classItem.save();

    const populatedClass = await Class.findById(updatedClass._id)
      .populate('batch', 'name subject')
      .populate('trainer', 'name email');

    res.json(populatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/classes/:id
// @desc    Delete a class
// @access  Private/Trainer or Admin
router.delete('/:id', protect, trainerOrAdmin, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Trainers can only delete their own classes, admins can delete any
    if (req.user.role === 'trainer' && classItem.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this class' });
    }

    await classItem.deleteOne();
    res.json({ message: 'Class removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;