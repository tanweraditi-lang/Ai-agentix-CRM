const express = require('express');
const router = express.Router();
const {
  getFollowups,
  createFollowup,
  updateFollowup,
  deleteFollowup,
} = require('../controllers/followupController');

router.route('/')
  .get(getFollowups)
  .post(createFollowup);

router.route('/:id')
  .put(updateFollowup)
  .delete(deleteFollowup);

module.exports = router;
