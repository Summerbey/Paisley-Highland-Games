const Competitor = require('../models/Competitor');
const Event = require('../models/Event');

// @desc    Get all competitors
// @route   GET /api/competitors
// @access  Public
exports.getAllCompetitors = async (req, res) => {
  try {
    const competitors = await Competitor.find()
      .populate('registeredEvents', 'name category')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: competitors.length,
      data: competitors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single competitor
// @route   GET /api/competitors/:id
// @access  Public
exports.getCompetitor = async (req, res) => {
  try {
    const competitor = await Competitor.findById(req.params.id)
      .populate('registeredEvents', 'name category status');
    
    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }
    
    res.json({
      success: true,
      data: competitor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new competitor
// @route   POST /api/competitors
// @access  Public
exports.createCompetitor = async (req, res) => {
  try {
    const competitor = await Competitor.create(req.body);
    
    res.status(201).json({
      success: true,
      data: competitor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create competitor',
      error: error.message
    });
  }
};

// @desc    Update competitor
// @route   PUT /api/competitors/:id
// @access  Private
exports.updateCompetitor = async (req, res) => {
  try {
    const competitor = await Competitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }
    
    res.json({
      success: true,
      data: competitor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update competitor',
      error: error.message
    });
  }
};

// @desc    Delete competitor
// @route   DELETE /api/competitors/:id
// @access  Private
exports.deleteCompetitor = async (req, res) => {
  try {
    const competitor = await Competitor.findByIdAndDelete(req.params.id);
    
    if (!competitor) {
      return res.status(404).json({
        success: false,
        message: 'Competitor not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Competitor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Register competitor for event
// @route   POST /api/competitors/:id/register/:eventId
// @access  Public
exports.registerForEvent = async (req, res) => {
  try {
    const competitor = await Competitor.findById(req.params.id);
    const event = await Event.findById(req.params.eventId);
    
    if (!competitor || !event) {
      return res.status(404).json({
        success: false,
        message: 'Competitor or Event not found'
      });
    }
    
    // Check if event is full
    if (event.currentCompetitors >= event.maxCompetitors) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }
    
    // Check if already registered
    if (competitor.registeredEvents.includes(req.params.eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }
    
    // Add event to competitor
    competitor.registeredEvents.push(req.params.eventId);
    await competitor.save();
    
    // Update event competitor count
    event.currentCompetitors += 1;
    if (event.currentCompetitors >= event.maxCompetitors) {
      event.status = 'Full';
    }
    await event.save();
    
    res.json({
      success: true,
      data: competitor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};