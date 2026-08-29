const mongoose = require('mongoose');
const Note = require('../models/Note');
const { logActivity, getLeadActivities } = require('../utils/activityLogger');

const inMemoryNotes = [
  {
    id: 'n101',
    _id: 'n101',
    leadId: '1',
    note: 'Client requested integrated API pricing breakdown and timeline details.',
    createdBy: 'Priya Patel',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'n102',
    _id: 'n102',
    leadId: '2',
    note: 'Initial intro call completed. Scheduled AI scoring demo for next Tuesday.',
    createdBy: 'Amit Verma',
    createdAt: new Date(Date.now() - 172800000),
  },
];

// @desc    Get all notes for a specific lead
// @route   GET /api/leads/:id/notes
const getNotesByLeadId = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const notes = await Note.find({ leadId: id }).sort({ createdAt: -1 });
      const mappedNotes = notes.map(n => ({
        ...n.toObject(),
        id: n._id.toString(),
      }));
      return res.status(200).json({
        success: true,
        count: mappedNotes.length,
        notes: mappedNotes,
      });
    } else {
      const notes = inMemoryNotes.filter(n => n.leadId === id || n.leadId === '1');
      return res.status(200).json({
        success: true,
        count: notes.length,
        notes,
      });
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching notes',
      error: error.message,
    });
  }
};

// @desc    Create a new note for a lead
// @route   POST /api/leads/:id/notes
const createNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, createdBy } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note text cannot be empty',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    const author = createdBy || 'System Admin';
    let newNote;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      newNote = await Note.create({
        leadId: id,
        note: note.trim(),
        createdBy: author,
      });

      const noteObj = newNote.toObject ? newNote.toObject() : newNote;
      newNote = { ...noteObj, id: newNote._id.toString() };
    } else {
      newNote = {
        id: 'note_' + Date.now(),
        _id: 'note_' + Date.now(),
        leadId: id,
        note: note.trim(),
        createdBy: author,
        createdAt: new Date(),
      };
      inMemoryNotes.unshift(newNote);
    }

    // Automatically log activity for Note Created
    const noteSnippet = note.length > 40 ? note.trim().substring(0, 40) + '...' : note.trim();
    await logActivity(id, 'Note Added', `Added note: "${noteSnippet}"`, author);

    return res.status(201).json({
      success: true,
      message: 'Note added successfully',
      note: newNote,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating note',
      error: error.message,
    });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note text cannot be empty',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Note.findByIdAndUpdate(
        id,
        { note: note.trim() },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }

      await logActivity(updated.leadId, 'Note Edited', `Updated note text`, updated.createdBy || 'System Admin');

      const noteObj = updated.toObject ? updated.toObject() : updated;
      return res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        note: { ...noteObj, id: updated._id.toString() },
      });
    } else {
      const idx = inMemoryNotes.findIndex(n => n.id === id || n._id === id);
      if (idx !== -1) {
        inMemoryNotes[idx].note = note.trim();
        await logActivity(inMemoryNotes[idx].leadId, 'Note Edited', `Updated note text`);
        return res.status(200).json({
          success: true,
          message: 'Note updated successfully',
          note: inMemoryNotes[idx],
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating note',
      error: error.message,
    });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Note.findByIdAndDelete(id);
      if (deleted) {
        await logActivity(deleted.leadId, 'Note Deleted', `Removed note record`);
      }
    } else {
      const idx = inMemoryNotes.findIndex(n => n.id === id || n._id === id);
      if (idx !== -1) {
        const leadId = inMemoryNotes[idx].leadId;
        inMemoryNotes.splice(idx, 1);
        await logActivity(leadId, 'Note Deleted', `Removed note record`);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting note',
      error: error.message,
    });
  }
};

// @desc    Get activity timeline for a lead
// @route   GET /api/leads/:id/activity
const getLeadActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activities = await getLeadActivities(id);

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error('Error fetching lead activity timeline:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching activity timeline',
      error: error.message,
    });
  }
};

module.exports = {
  getNotesByLeadId,
  createNote,
  updateNote,
  deleteNote,
  getLeadActivity,
};
