const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

// GET: /trips - lists all trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find({}) // Return  record
        .exec();

        // Uncomment the following line to show results of query in the console
        // console.log(q);

    if(!q)
    { // Database query failed
        return res
            .status(404)
            .json(err);
    }
    else
    { // return query results
        return res
            .status(200)
            .json(q);
    }

};

// GET: /trips - lists a single trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode }) // Return single record
        .exec();

        // Uncomment the following line to show results of query in the console
        // console.log(q);

    if(!q)
    { // Database query failed
        return res
            .status(404)
            .json(err);
    }
    else
    { // return query results
        return res
            .status(200)
            .json(q);
    }
};
// POST: /trips - add a new trip
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();

    if(!q)
    { // Database returned no data
        return res
            .status(400)
            .json(err);
    
    } else { //return new trip
        return res
            .status(201)
            .json(q);
    }
};

// PUT: /trips/:tripCode - Adds a new Trip 
// Regardless of outcome, response must include HTML status code 
// and JSON message to the requesting client 
const tripsUpdateTrip = async(req, res) => { 
 
    // Uncomment for debugging 
    console.log(req.params); 
    console.log(req.body); 
 
    const q = await Model 
        .findOneAndUpdate( 
            { 'code' : req.params.tripCode }, 
            { 
                code: req.body.code, 
                name: req.body.name, 
                length: req.body.length, 
                start: req.body.start, 
                resort: req.body.resort, 
                perPerson: req.body.perPerson, 
                image: req.body.image, 
                description: req.body.description 
            }  
        ) 
        .exec(); 
         
        if(!q) 
        { // Database returned no data 
            return res 
                .status(400) 
                .json(err);
                } else { // Return resulting updated trip 
            return res 
                .status(201) 
                .json(q); 
        }     
                
        // Uncomment the following line to show results of operation 
        // on the console 
        // console.log(q); 
};

// GET: /admin/export/trips - exports trips data in JSON or CSV format
// Admin-only endpoint that supports filtering by destination
// Query params: format (csv|json), destination (optional)
const exportTrips = async (req, res) => {
    try {
        // Build MongoDB filter
        const filter = {};
        if (req.query.destination) {
            filter.resort = req.query.destination; // Using 'resort' field as destination
        }

        // Define projection to return only specific fields
        const projection = {
            code: 1,
            name: 1,
            resort: 1,      // This represents destination
            start: 1,       // This represents startDate
            perPerson: 1,   // This represents price
            _id: 0          // Exclude MongoDB _id
        };

        // Query MongoDB with filter and projection
        const trips = await Model
            .find(filter, projection)
            .exec();

        if (!trips) {
            return res.status(404).json({ message: 'No trips found' });
        }

        // Determine export format (default to JSON)
        const format = req.query.format || 'json';

        if (format === 'csv') {
            // Convert to CSV format
            if (trips.length === 0) {
                return res
                    .status(200)
                    .type('text/csv')
                    .send('code,name,destination,startDate,price\n');
            }

            // Build CSV header
            let csv = 'code,name,destination,startDate,price\n';

            // Build CSV rows
            trips.forEach(trip => {
                const code = trip.code || '';
                const name = trip.name ? `"${trip.name.replace(/"/g, '""')}"` : '';
                const destination = trip.resort || '';
                const startDate = trip.start ? new Date(trip.start).toISOString().split('T')[0] : '';
                const price = trip.perPerson || '';
                
                csv += `${code},${name},${destination},${startDate},${price}\n`;
            });

            // Return CSV response
            return res
                .status(200)
                .type('text/csv')
                .send(csv);
        } else {
            // Return JSON format (default)
            // Map field names to match requested output
            const formattedTrips = trips.map(trip => ({
                code: trip.code,
                name: trip.name,
                destination: trip.resort,
                startDate: trip.start,
                price: trip.perPerson
            }));

            return res
                .status(200)
                .json(formattedTrips);
        }
    } catch (err) {
        console.error('Export error:', err);
        return res
            .status(500)
            .json({ message: 'Error exporting trips', error: String(err) });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    exportTrips
};