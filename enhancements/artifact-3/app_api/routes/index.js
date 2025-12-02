const express = require('express');
const router = express.Router(); // Router logic
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens 

// Import the controller module
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT 
function authenticateJWT(req, res, next) { 
    // console.log('In Middleware'); 
 
    const authHeader = req.headers['authorization']; 
    // console.log('Auth Header: ' + authHeader); 
 
    if (authHeader == null) { 
        console.log('Auth Header Required but NOT PRESENT!'); 
        return res.status(401).json('Authorization header required'); 
    } 
 
    let headers = authHeader.split(' '); 
    if (headers.length < 2) { 
        console.log('Not enough tokens in Auth Header: ' + headers.length); 
        return res.status(401).json('Invalid Authorization header'); 
    } 
 
    const token = headers[1]; 
    // console.log('Token: ' + token); 
 
    if (token == null) { 
        console.log('Null Bearer Token'); 
        return res.status(401).json('Missing bearer token'); 
    } 
 
    // console.log(process.env.JWT_SECRET);
    // console.log(jwt.decode(token)); 
    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => { 
        if (err) { 
            console.log('Token Validation Error!', err);
            return res.status(401).json('Token Validation Error!'); 
        }  
        req.auth = verified; // Set the auth param to the decoded object 
        next(); // Continue only after successful verification
    }); 
}

// Middleware to check if user has admin role
// Must be used after authenticateJWT middleware
function requireAdmin(req, res, next) {
    // Check if user is authenticated and has admin role
    if (!req.auth) {
        console.log('Authentication required for admin access');
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.auth.role !== 'admin') {
        console.log('Admin access denied for user:', req.auth.email);
        return res.status(403).json({ message: 'Admin access required' });
    }

    // User is admin, continue to next middleware/handler
    next();
}

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

// define the route for GET /trips
router
    .route('/trips')
    .get(tripsController.tripsList) // GET method routes
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST method routes

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET method routes
    .put(authenticateJWT, tripsController.tripsUpdateTrip); // PUT method routes

// Admin-only export endpoint
// Requires authentication and admin role
// Query params: format=csv|json, destination=<resort_name> (optional)
router
    .route('/admin/export/trips')
    .get(authenticateJWT, requireAdmin, tripsController.exportTrips);

module.exports = router;