const express = require('express');
const router = express.Router();
const { getLeads, getLeadById } = require('../controllers/leadController');

router.get('/', getLeads);
router.get('/:id', getLeadById);

module.exports = router;
