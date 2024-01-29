const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const File = mongoose.model('File');
const { requireUser } = require('../../config/passport');
const validateFileInput = require('../../validation/files');

router.get('/', async (req, res) => {
  try {
    const files = await File.find()
                              .populate("author", "_id username")
                              .sort({ createdAt: -1 });
    return res.json(files);
  }
  catch(err) {
    return res.json([]);
  }
})

router.get('/user/:userId', async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userId);
  } catch(err) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errors = { message: "No user found with that id" };
    return next(error);
  }
  try {
    const files = await File.find({ author: user._id })
                              .sort({ createdAt: -1 })
                              .populate("author", "_id username");
    return res.json(files);
  }
  catch(err) {
    return res.json([]);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)
                             .populate("author", "_id username");
    return res.json(file);
  }
  catch(err) {
    const error = new Error('File not found');
    error.statusCode = 404;
    error.errors = { message: "No file found with that id" };
    return next(error);
  }
})

// Attach requireUser as a middleware before the route handler to gain access
// to req.user. (requireUser will return an error response if there is no 
// current user.) Also attach validateFileInput as a middleware before the 
// route handler.
router.post('/', requireUser, validateFileInput, async (req, res, next) => {
  try {
    const newFile = new File({
      text: req.body.text,
      author: req.user._id
    });

    let file = await newFile.save();
    file = await file.populate('author', '_id username');
    return res.json(file);
  }
  catch(err) {
    next(err);
  }
});

module.exports = router;
