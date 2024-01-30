const OpenAIApi = require("openai");
require('dotenv').config({path:'../../.env'})

const express = require("express");
const { response } = require("../../app");
const Trip = require("../../models/Trip");
const router = express.Router();

const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

/// ACTUAL BACKEND TRIP STUFF

// UPDATE TRIP
router.patch('/:id', async (req,res) => {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })

    try{
        res.status(200).json({
            status : 'Success',
            data : {
              updatedTrip
            }
          })
    }catch(err){
        console.log(err)
    }
})

// DELETE TRIP
router.delete('/:id', async(req,res) => {
    console.log("========");
    console.log(req.params.id);

    const deletedTrip = await Trip.findByIdAndDelete(req.params.id)
    
    try{
      res.status(200).json({
          status : 'Success',
          data : {}
      })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

// GET ALL TRIPS
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find().populate("author", "_id username")
                                .sort({ createdAt: -1 });
        return res.json(trips);
    }
    catch(err) {
        return res.json([]);
    }
})

// GET/SHOW TRIP
router.get('/:id', async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id)
                                // .populate("author", "_id username");
        return res.json(trip);
    }
    catch(err) {
        const error = new Error('Trip not found');
        error.statusCode = 404;
        error.errors = { message: "No trip found with that id" };
        return next(error);
    }
})

// POST TRIP
router.post('/', async (req, res, next) => {
    try {
    
        const newTrip = new Trip({
            location: req.body.location,
            dates: req.body.dates,
            author: req.body.authorId
        });
        // console.log("=======");
        // console.log(newTrip);
        // console.log("=======");

        let trip = await newTrip.save();
        trip = await trip.populate('author', '_id username');
        return res.json(trip);
    }
    catch(err) {
        next(err);
    }
  });


module.exports = router;