const OpenAIApi = require("openai");
require('dotenv').config({path:'../../.env'})

const express = require("express");
const { response } = require("../../app");
const router = express.Router();
// console.log(require('dotenv').config({path:'../../.env'}))
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// console.log(process.env.SOME_KEY);
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

// async function runCompletion(name, weatherPref, locationPref) {
//     try {
//         const completion = await openai.chat.completions.create({
//             messages: [{ role: 'system', 
//             // content: 'You are a helpful assistant.' 
//             content: `Create an itinerary for a user with the following preferences: 
//             {
//                 "Name": ${name},
//                 "Weather preference": ${weatherPref},
//                 "Location preference": ${locationPref},
//                 "Interests": "",
//                 "Misc Info": ""
//             }
                      
//             Your response must maintain the key names EXACTLY as they are shown here below.  This will be JSON parsed.
//             The location value should include a city AND a country, at least.
//             The trip will be 3 days long, and will have 4 activities per day - your response should reflect this while maintaining the name structure of the below keys.
            
//             Here is an example:
//             {
//                 "location": "",
//                 "Activities": {
//                     "Day 1": {
//                         "activity1": "",
//                         "activity2": "",
//                         "activity3": ""
//                     },
//                     "Day 2": {
//                         "activity1": "",
//                         "activity2": "",
//                         "activity3": ""
//                     },
//                     "Day 3": {
//                         "activity1": "",
//                         "activity2": "",
//                         "activity3": ""
//                     },
//                     "Day 4": {
//                         "activity1": "",
//                         "activity2": "",
//                         "activity3": ""
//                     }
//                 }
//             }
//             `
//             }],
//             model: 'gpt-3.5-turbo',
//             max_tokens: 1000
//         });

//         // if (completion.choices !== null && completion.choices !== undefined) {
//         //     // console.log(completion.choices);
//         //     console.log(completion.choices[0].message.content);
            
//         //     return JSON.parse(completion.choices[0].message.content);
//         // }
        
//         // console.log(JSON.parse(completion.choices[0].message.content));
//         // setResponse(completion.choices[0].message.content);
//         // setItinerary(JSON.parse(completion.choices[0].message.content));
//     } catch (error) {
//         console.error('Error fetching response:', error);
//     }
    
// }

// runCompletion("Bob", "cold", "usa");
// console.log();

router.post('/', async (req, res, next) => {
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