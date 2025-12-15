const express = require('express');
const router = express.Router();
const {
  getAllCompetitors,
  getCompetitor,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
  registerForEvent
} = require('../controllers/competitorController');

// Routes
router.route('/')
  .get(getAllCompetitors)
  .post(createCompetitor);

router.route('/:id')
  .get(getCompetitor)
  .put(updateCompetitor)
  .delete(deleteCompetitor);

// Special route for event registration
router.post('/:id/register/:eventId', registerForEvent);

module.exports = router;