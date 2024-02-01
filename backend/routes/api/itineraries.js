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
        let location = req.body.location;
        let mealType = req.body.mealType;
        let setting = req.body.setting;
        let cuisineType = req.body.cuisineType;

        // completion = runCompletion(tripPrefs.name, tripPrefs.weatherPref, tripPrefs.locationPref);
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', 
            // content: 'You are a helpful assistant.' 
            content: `Create a list of possible restaurants for a travelling user to go to with the following preferences: 
            {
                "Location": ${location}
                "Meal Type": ${mealType}
                "Setting": ${setting}
                "Type Of Cuisine": ${cuisineType}
            }
                      
            Your response must maintain the key names EXACTLY as they are shown here below.  This will be JSON parsed.
            You will suggest a total of 9 restaurants a user could visit.  Your response should reflect this while maintaining the name structure of the below keys.
            
            Here is an example:
            {
                "activity1": "Try the famous pastrami sandwich at Katz's Delicatessen.",
                "activity2": "Enjoy a classic steakhouse dinner at Peter Luger Steak House.",
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
            max_tokens: 500
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
        let timeOfDay = req.body.timeOfDay;
        let interests = req.body.interests;

        // completion = runCompletion(tripPrefs.name, tripPrefs.weatherPref, tripPrefs.locationPref);
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', 
            // content: 'You are a helpful assistant.' 
            content: `Create a list of possible activities for a travelling user with the following preferences: 
            {
                "Location": ${location}
                "Time Of Day": ${timeOfDay}
                "Interests": ${interests}
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
            max_tokens: 500
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
        let location = req.body.location;
        let days = req.body.days;
        // completion = runCompletion(tripPrefs.name, tripPrefs.weatherPref, tripPrefs.locationPref);
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', 
            // content: 'You are a helpful assistant.' 
            content: `Create an itinerary for a user with the following preferences: 
            {
                "Location": ${location}
            }
                      
            Your response must maintain the key names EXACTLY as they are shown here below.  This will be JSON parsed.
            The trip will be ${days} days long, and will have 3 activities per day - your response should reflect this while maintaining the name structure of the below keys.
            Half of the activities you generate will be things you can do in the area.  The other half will be suggestions of a restaurant that a user could visit.

            Here is an example:
            {
                "Day 1": {
                    "activity1": "",
                    "activity2": "",
                    "restaurant1": "Try the famous pastrami sandwich at Katz's Delicatessen."
                },
                "Day 2": {
                    "activity1": "",
                    "activity2": "",
                    "restaurant1": ""
                },
                "Day 3": {
                    "activity1": "",
                    "activity2": "",
                    "restaurant1": ""
                },
                "Day 4": {
                    "activity1": "",
                    "activity2": "",
                    "restaurant1": ""
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