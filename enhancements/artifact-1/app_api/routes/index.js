const express = require('express');
const router = express.Router();

// Import controllers
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Import middleware
const { requireAuth, requireRole } = require('../middleware/auth');
const { validateTrip, validateRegistration, validateLogin } = require('../middleware/validation');
const { ROLES } = require('../constants');

// Authentication routes
router.route('/register')
  .post(validateRegistration, authController.register);

router.route('/login')
  .post(validateLogin, authController.login);

// Trip routes
router.route('/trips')
  .get(tripsController.tripsList)
  .post(requireAuth, requireRole(ROLES.ADMIN), validateTrip, tripsController.tripsAddTrip);

router.route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(requireAuth, requireRole(ROLES.ADMIN), validateTrip, tripsController.tripsUpdateTrip)
  .delete(requireAuth, requireRole(ROLES.ADMIN), tripsController.tripsDeleteTrip);

module.exports = router;
