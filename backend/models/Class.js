const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },
        classType: {
      type: String,
      enum: ['longterm', 'single'],
      default: 'single'
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    teamsLink: {
      type: String,
      required: true,
      trim: true,
    },
    // Legacy single recording link — kept for backward compatibility with existing data
    recordingLink: {
      type: String,
      trim: true,
      default: '',
    },
    // New: multiple recordings per class, auto-labelled Part 1, Part 2, etc.
    recordings: {
      type: [
        {
          label: { type: String, trim: true, default: '' },
          url:   { type: String, trim: true, default: '' },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed'],
      default: 'scheduled',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model('Class', classSchema);

module.exports = Class;