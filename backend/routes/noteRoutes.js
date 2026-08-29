const express = require('express');
const router = express.Router();
const {
  getNotesByLeadId,
  createNote,
  updateNote,
  deleteNote,
  getLeadActivity,
} = require('../controllers/noteController');

// Direct Note Endpoints
router.route('/notes/:id')
  .put(updateNote)
  .delete(deleteNote);

// Lead Specific Note & Activity Endpoints
router.route('/leads/:id/notes')
  .get(getNotesByLeadId)
  .post(createNote);

router.route('/leads/:id/activity')
  .get(getLeadActivity);

module.exports = router;
