const OpenAIApi = require("openai");
require('dotenv').config({path:'../../.env'})

const express = require("express");
const { response } = require("../../app");
const Itinerary = require("../../models/Itinerary");
const router = express.Router();

const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

/// ACTUAL BACKEND TRIP STUFF

// UPDATE ITINERARY
router.patch('/:id', async (req,res) => {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      }).populate([{
            path: "author", 
            select: "_id username"
        }, {
            path: "trip",
            select: "_id location"
        }]);

    try{
        res.status(200).json({
            status : 'Success',
            data : {
              updatedItinerary
            }
          })
    }catch(err){
        console.log(err)
    }
})

// DELETE ITINERARY
router.delete('/:id', async(req,res) => {
    console.log("========");
    console.log(req.params.id);

    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id)
    
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

// GET ALL ITINERARIES
router.get('/', async (req, res) => {
    try {
        const itineraries = await Itinerary.find()
                                .populate([{
                                    path: "author", 
                                    select: "_id username"
                                }, {
                                    path: "trip",
                                    select: "_id location"
                                }])
                                .sort({ createdAt: -1 });
        return res.json(itineraries);
    }
    catch(err) {
        return res.json([]);
    }
})

// GET/SHOW ITINERARY
router.get('/:id', async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
                                                .populate([{
                                                    path: "author", 
                                                    select: "_id username"
                                                }, {
                                                    path: "trip",
                                                    select: "_id location"
                                                }])
        return res.json(itinerary);
    }
    catch(err) {
        const error = new Error('Trip not found');
        error.statusCode = 404;
        error.errors = { message: "No trip found with that id" };
        return next(error);
    }
})

// POST ITINERARY
router.post('/', async (req, res, next) => {
    try {
        const newItinerary = new Itinerary({
            itinerary: req.body.itinerary,
            author: req.body.author,
            trip: req.body.trip
        });

        // console.log("=====");
        // console.log(newItinerary);
        // console.log("=====");

        let itinerary = await newItinerary.save();
        itinerary = await itinerary.populate([{
            path: "author", 
            select: "_id username"
        }, {
            path: "trip",
            select: "_id location"
        }])
        return res.json(itinerary);
    }
    catch(err) {
        next(err);
    }
  });

/// CHATGPT TRIP STUFF
// SUGGEST RESTAURANTS
router.post('/GPT/restaurants', async (req, res, next) => {
    try {
        let name = req.body.name;
        let weatherPref = req.body.weatherPref;
        let locationPref = req.body.locationPref;
        let interests = req.body.interests;
        let miscInfo = req.body.miscInfo;
        let days = req.body.days;
        let activitiesPerDay = req.body.activitiesPerDay;
        // completion = runCompletion(tripPrefs.name, tripPrefs.weatherPref, tripPrefs.locationPref);
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', 
            // content: 'You are a helpful assistant.' 
            content: `Create an itinerary for a user with the following preferences: 
            {
                "Name": ${name},
                "Weather preference": ${weatherPref},
                "Location preference": ${locationPref},
                "Interests": ${interests},
                "Misc Info": ${miscInfo}
            }
                      
            Your response must maintain the key names EXACTLY as they are shown here below.  This will be JSON parsed.
            The location value should include a city AND a country, at least.
            The trip will be ${days} days long, and will have ${activitiesPerDay} activities per day - your response should reflect this while maintaining the name structure of the below keys.
            
            Here is an example:
            {
                "location": "",
                "Activities": {
                    "Day 1": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    },
                    "Day 2": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    },
                    "Day 3": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    },
                    "Day 4": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    }
                }
            }
            `
            }],
            model: 'gpt-3.5-turbo',
            max_tokens: 1000
        });

        if (completion.choices !== null && completion.choices !== undefined) {
            // console.log("=======");
            console.log(completion.choices);
            console.log(completion.choices[0].message.content);
            let response = JSON.parse(completion.choices[0].message.content);
            return res.json(response);
            // return response;
        }
    }
    catch(err) {
      next(err);
    }
  });

// SUGGEST ACTIVITIES
router.post('/GPT/activities', async (req, res, next) => {
    try {
        let location = req.body.location;

        // completion = runCompletion(tripPrefs.name, tripPrefs.weatherPref, tripPrefs.locationPref);
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', 
            // content: 'You are a helpful assistant.' 
            content: `Create a list of possible activities for a travelling user with the following preferences: 
            {
                "Location": ${location}
            }
                      
            Your response must maintain the key names EXACTLY as they are shown here below.  This will be JSON parsed.
            You will suggest a total of 9 activities.  Your response should reflect this while maintaining the name structure of the below keys.
            
            Here is an example:
            {
                "activity1": "",
                "activity2": "",
                "activity3": "",
                "activity4": "",
                "activity5": "",
                "activity6": "",
                "activity7": "",
                "activity8": "",
                "activity9": "",
            }
            `
            }],
            model: 'gpt-3.5-turbo',
            max_tokens: 200
        });

        if (completion.choices !== null && completion.choices !== undefined) {
            // console.log("=======");
            console.log(completion.choices);
            console.log(completion.choices[0].message.content);
            let response = JSON.parse(completion.choices[0].message.content);
            return res.json(response);
            // return response;
        }
    }
    catch(err) {
      next(err);
    }
  });

/// GENERATE ITINERARY
router.post('/GPT', async (req, res, next) => {
    try {
        let name = req.body.name;
        let weatherPref = req.body.weatherPref;
        let locationPref = req.body.locationPref;
        let interests = req.body.interests;
        let miscInfo = req.body.miscInfo;
        let days = req.body.days;
        let activitiesPerDay = req.body.activitiesPerDay;
        // completion = runCompletion(tripPrefs.name, tripPrefs.weatherPref, tripPrefs.locationPref);
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', 
            // content: 'You are a helpful assistant.' 
            content: `Create an itinerary for a user with the following preferences: 
            {
                "Name": ${name},
                "Weather preference": ${weatherPref},
                "Location preference": ${locationPref},
                "Interests": ${interests},
                "Misc Info": ${miscInfo}
            }
                      
            Your response must maintain the key names EXACTLY as they are shown here below.  This will be JSON parsed.
            The location value should include a city AND a country, at least.
            The trip will be ${days} days long, and will have ${activitiesPerDay} activities per day - your response should reflect this while maintaining the name structure of the below keys.
            
            Here is an example:
            {
                "location": "",
                "Activities": {
                    "Day 1": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    },
                    "Day 2": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    },
                    "Day 3": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    },
                    "Day 4": {
                        "activity1": "",
                        "activity2": "",
                        "activity3": ""
                    }
                }
            }
            `
            }],
            model: 'gpt-3.5-turbo',
            max_tokens: 1000
        });

        if (completion.choices !== null && completion.choices !== undefined) {
            // console.log("=======");
            console.log(completion.choices);
            console.log(completion.choices[0].message.content);
            let response = JSON.parse(completion.choices[0].message.content);
            return res.json(response);
            // return response;
        }
    }
    catch(err) {
      next(err);
    }
  });

module.exports = router;