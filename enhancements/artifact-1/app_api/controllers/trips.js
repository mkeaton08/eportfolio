const tripService = require('../services/tripService');
const { STATUS_CODES, ERROR_MESSAGES } = require('../constants');

// GET: /trips - lists all trips
const tripsList = async (req, res, next) => {
  try {
    const trips = await tripService.getAllTrips();
    return res.status(STATUS_CODES.OK).json(trips);
  } catch (err) {
    next(err);
  }
};

// GET: /trips/:tripCode - get a single trip by code
const tripsFindByCode = async (req, res, next) => {
  try {
    const trip = await tripService.getTripByCode(req.params.tripCode);
    
    if (!trip) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ 
        message: ERROR_MESSAGES.TRIP_NOT_FOUND 
      });
    }
    
    return res.status(STATUS_CODES.OK).json(trip);
  } catch (err) {
    next(err);
  }
};

// POST: /trips - add a new trip
const tripsAddTrip = async (req, res, next) => {
  try {
    const tripData = {
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    };

    const newTrip = await tripService.createTrip(tripData);
    return res.status(STATUS_CODES.CREATED).json(newTrip);
  } catch (err) {
    next(err);
  }
};

// PUT: /trips/:tripCode - update a trip
const tripsUpdateTrip = async (req, res, next) => {
  try {
    const tripData = {
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    };

    const updatedTrip = await tripService.updateTripByCode(req.params.tripCode, tripData);
    
    if (!updatedTrip) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ 
        message: ERROR_MESSAGES.TRIP_NOT_FOUND 
      });
    }
    
    return res.status(STATUS_CODES.OK).json(updatedTrip);
  } catch (err) {
    next(err);
  }
};

// DELETE: /trips/:tripCode - delete a trip
const tripsDeleteTrip = async (req, res, next) => {
  try {
    const deletedTrip = await tripService.deleteTripByCode(req.params.tripCode);
    
    if (!deletedTrip) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ 
        message: ERROR_MESSAGES.TRIP_NOT_FOUND 
      });
    }
    
    return res.status(STATUS_CODES.OK).json({ 
      message: 'Trip deleted successfully' 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};
