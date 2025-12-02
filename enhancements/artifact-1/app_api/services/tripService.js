const Trip = require('../models/travlr');

// Get all trips
const getAllTrips = async () => {
  return await Trip.find({}).exec();
};

// Get trip by code
const getTripByCode = async (tripCode) => {
  return await Trip.findOne({ code: tripCode }).exec();
};

// Create a new trip
const createTrip = async (tripData) => {
  const newTrip = new Trip(tripData);
  return await newTrip.save();
};

// Update a trip by code
const updateTripByCode = async (tripCode, tripData) => {
  return await Trip.findOneAndUpdate(
    { code: tripCode },
    tripData,
    { new: true, runValidators: true }
  ).exec();
};

// Delete a trip by code
const deleteTripByCode = async (tripCode) => {
  return await Trip.findOneAndDelete({ code: tripCode }).exec();
};

module.exports = {
  getAllTrips,
  getTripByCode,
  createTrip,
  updateTripByCode,
  deleteTripByCode
};
