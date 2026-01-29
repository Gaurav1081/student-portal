const express = require('express');
const Batch = require('../models/Batch');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

// @route   GET /api/batches
// @desc    Get all batches
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const batches = await Batch.find({})
      .populate('trainer', 'name email subject')
      .populate('students', 'name email');
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Failed to fetch batches', error: error.message });
  }
});

// @route   GET /api/batches/:id
// @desc    Get batch by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid batch ID format' });
    }

    const batch = await Batch.findById(req.params.id)
      .populate('trainer', 'name email subject')
      .populate('students', 'name email');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ message: 'Failed to fetch batch', error: error.message });
  }
});

// @route   POST /api/batches
// @desc    Create a new batch
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, subject, trainer, startDate, endDate } = req.body;

    // Validation
    if (!name || !subject || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, subject, startDate, endDate' 
      });
    }

    // Validate trainer if provided
    if (trainer && !mongoose.Types.ObjectId.isValid(trainer)) {
      return res.status(400).json({ message: 'Invalid trainer ID format' });
    }

    const batch = await Batch.create({
      name,
      subject,
      trainer: trainer || null,
      startDate,
      endDate,
    });

    const populatedBatch = await Batch.findById(batch._id)
      .populate('trainer', 'name email subject');

    res.status(201).json(populatedBatch);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ message: 'Failed to create batch', error: error.message });
  }
});

// @route   PUT /api/batches/:id
// @desc    Update a batch
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid batch ID format' });
    }

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const { name, subject, trainer, startDate, endDate, students } = req.body;

    // Validate trainer if provided
    if (trainer && !mongoose.Types.ObjectId.isValid(trainer)) {
      return res.status(400).json({ message: 'Invalid trainer ID format' });
    }

    batch.name = name || batch.name;
    batch.subject = subject || batch.subject;
    batch.trainer = trainer !== undefined ? trainer : batch.trainer;
    batch.startDate = startDate || batch.startDate;
    batch.endDate = endDate || batch.endDate;
    batch.students = students || batch.students;

    const updatedBatch = await batch.save();

    const populatedBatch = await Batch.findById(updatedBatch._id)
      .populate('trainer', 'name email subject')
      .populate('students', 'name email');

    res.json(populatedBatch);
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ message: 'Failed to update batch', error: error.message });
  }
});

// @route   DELETE /api/batches/:id
// @desc    Delete a batch
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid batch ID format' });
    }

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Remove batch reference from all students
    await User.updateMany(
      { batch: batch._id },
      { $set: { batch: null } }
    );

    await batch.deleteOne();
    res.json({ message: 'Batch removed successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Failed to delete batch', error: error.message });
  }
});

// @route   PUT /api/batches/:id/add-students
// @desc    Add multiple students to a batch
// @access  Private/Admin
router.put('/:id/add-students', protect, adminOnly, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid batch ID format' });
    }

    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ message: 'studentIds must be an array' });
    }

    // Validate all student IDs
    const invalidIds = studentIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: 'Invalid student ID format in array' });
    }

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Add students to batch (avoid duplicates)
    studentIds.forEach((studentId) => {
      if (!batch.students.includes(studentId)) {
        batch.students.push(studentId);
      }
    });

    await batch.save();

    // Update students' batch reference
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $set: { batch: batch._id } }
    );

    const populatedBatch = await Batch.findById(batch._id)
      .populate('trainer', 'name email subject')
      .populate('students', 'name email');

    res.json(populatedBatch);
  } catch (error) {
    console.error('Error adding students to batch:', error);
    res.status(500).json({ message: 'Failed to add students', error: error.message });
  }
});

// @route   PUT /api/batches/:id/sync-students
// @desc    Sync students with batch (handles add and remove)
// @access  Private/Admin
router.put('/:id/sync-students', protect, adminOnly, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid batch ID format' });
    }

    const { studentIds } = req.body;

    if (!Array.isArray(studentIds)) {
      return res.status(400).json({ message: 'studentIds must be an array' });
    }

    // Validate all student IDs
    const invalidIds = studentIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: 'Invalid student ID format in array' });
    }

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const currentStudentIds = batch.students.map(id => id.toString());
    const newStudentIds = studentIds || [];

    const studentsToAdd = newStudentIds.filter(id => !currentStudentIds.includes(id));
    const studentsToRemove = currentStudentIds.filter(id => !newStudentIds.includes(id));

    batch.students = newStudentIds;
    await batch.save();

    // Update students being added
    if (studentsToAdd.length > 0) {
      await User.updateMany(
        { _id: { $in: studentsToAdd } },
        { $set: { batch: batch._id } }
      );
    }

    // Update students being removed
    if (studentsToRemove.length > 0) {
      await User.updateMany(
        { _id: { $in: studentsToRemove } },
        { $set: { batch: null } }
      );
    }

    const populatedBatch = await Batch.findById(batch._id)
      .populate('trainer', 'name email subject')
      .populate('students', 'name email');

    res.json(populatedBatch);
  } catch (error) {
    console.error('Error syncing students:', error);
    res.status(500).json({ message: 'Failed to sync students', error: error.message });
  }
});

module.exports = router;