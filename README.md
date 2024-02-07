# TravelAI App

## Overview

The TravelAI App is designed to transform the travel planning experience by harnessing the power of artificial intelligence, delivered through a user-friendly interface. This application caters to the modern traveler, offering personalized itinerary planning, travel recommendations, and a seamless user experience from start to finish. By integrating the MERN stack with the OpenAI API, TravelAI App provides a unique solution to travel planning that is both innovative and accessible.

[Explore the TravelAI App Live Site](https://travelaiapp.onrender.com/)

## Technologies Used

Leveraging a comprehensive technology stack, the app delivers high performance, scalability, and security:

- **MongoDB**: A NoSQL database that offers flexibility and scalability for our application's data storage needs.
- **Express.js**: This web application framework for Node.js helps in managing servers and routes.
- **React.js**: A front-end library used for building user interfaces, especially single-page applications where a seamless user experience is key.
- **Node.js**: The JavaScript runtime environment that executes JavaScript code server-side, powering our backend.
- **OpenAI API**: Utilized for generating dynamic and personalized travel recommendations, enhancing the core functionality of our app.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **bcrypt**: A powerful library for hashing and securing user passwords.

## Core Features

### User Authentication System

Secure and efficient user authentication is critical for protecting user data and providing a seamless experience.

**Implementation Overview**:
- Utilized JWT for secure token-based authentication.
- Integrated bcrypt for hashing user passwords, ensuring data security.
- Developed a responsive login and registration interface with React.js.

**Challenges & Solutions**:
One of the main challenges was preventing unauthorized access while maintaining a user-friendly experience. We introduced an auto-refresh token mechanism that renews user sessions without manual re-login, balancing security with convenience.

```javascript
app.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken({ username: decoded.username });
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(403);
  }
});
```

### Dynamic Itinerary Planning with OpenAI

Utilizing OpenAI to generate itineraries tailored to user preferences.

**Implementation Overview**:
- Designed a system that sends user preferences and historical data to the OpenAI model to generate tailored travel suggestions.
- Implemented an interface for users to fine-tune their preferences and receive updated recommendations in real-time.
- Utilized MongoDB to store itinerary items for dynamic retrieval and updates.

**Challenges & Solutions**:
Getting OpenAI's API to produce reliable output that served our goals took quite a bit of tweaking.  Ultimately, we were able to successfully fine tune our requests in the backend that served up the information we needed from ChatGPT.

Below, you'll find the request we send to OpenAI when a user clicks the "Suggest Activities" button.  The user passes in the optional fields of time of day and interests, and the location field is pulled from the trip in the front-end prior to the sending of the request.

ChatGPT reads the request, and sends back a data block in the format that we've requested, allowing us to read the response and format it properly into our application.

```javascript
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
```

### Trip Management (CRUD Operations)

Comprehensive control over travel plans through Create, Read, Update, and Delete operations.

### Implementation Overview

**Frontend (React.js):**
- Developed user-friendly interfaces for adding new trips, viewing existing trips, editing trip details, and deleting trips.
- Implemented forms for trip creation and editing with real-time validation to ensure data integrity.

**Backend (Node.js & Express.js):**
- Created RESTful API endpoints to handle CRUD operations for trips.
- Utilized MongoDB for storing trip information, including destinations, dates, and personalized itineraries.

**Database (MongoDB):**
- Designed a Trip schema to efficiently store and manage user trip data, including fields for destination, dates, and related activities.

### Technical Challenges and Solutions

**Challenge: Ensuring Data Consistency and Integrity**
- Ensuring that trip data remains consistent and valid throughout CRUD operations was a challenge, particularly when dealing with simultaneous edits or deletions.

**Solution:**
- Implemented transactional operations with MongoDB to ensure that all CRUD operations are atomic and consistent. Additionally, we used optimistic concurrency control to handle simultaneous edits, ensuring that the latest changes are accurately reflected without overwriting.

```javascript
app.post('/api/trips', async (req, res) => {
  const { userId, destination, startDate, endDate, itineraryItems } = req.body;

  try {
    const newTrip = new Trip({
      user: userId,
      destination,
      startDate,
      endDate,
      itineraryItems,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: 'Error creating trip', error: error.message });
  }
});
```

This route exemplifies how we handle trip creation requests, including data validation and interaction with the MongoDB database to save the new trip. It's a critical component of our CRUD functionality, enabling users to start planning their journeys within the Travel AI App.

## Future Enhancements

- **Enhanced AI Personalization**: Further refine the AI's understanding of user preferences for even more tailored travel suggestions.
- **Social Features**: Implement functionality for users to share itineraries and travel experiences within the app.
- **Multi-language Support**: Expand the app's accessibility by introducing multi-language support, catering to a global user base.

## Conclusion

The TravelAI App stands at the intersection of technology and travel, offering a new paradigm in travel planning. Through the use of cutting-edge technologies and innovative solutions to complex challenges, this application provides a glimpse into the future of personalized travel experiences. We invite you to start your next adventure with us.
