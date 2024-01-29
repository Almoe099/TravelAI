const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Note = mongoose.model('Note');
const { requireUser } = require('../../config/passport');
const validateNoteInput = require('../../validation/notes');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find()
                              .populate("author", "_id username")
                              .sort({ createdAt: -1 });
    return res.json(notes);
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
    const notes = await Note.find({ author: user._id })
                              .sort({ createdAt: -1 })
                              .populate("author", "_id username");
    return res.json(notes);
  }
  catch(err) {
    return res.json([]);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
                             .populate("author", "_id username");
    return res.json(note);
  }
  catch(err) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    error.errors = { message: "No note found with that id" };
    return next(error);
  }
})

// Attach requireUser as a middleware before the route handler to gain access
// to req.user. (requireUser will return an error response if there is no 
// current user.) Also attach validateNoteInput as a middleware before the 
// route handler.
router.post('/', requireUser, validateNoteInput, async (req, res, next) => {
  try {
    const newNote = new Note({
      text: req.body.text,
      author: req.user._id
    });

    let note = await newNote.save();
    note = await note.populate('author', '_id username');
    return res.json(note);
  }
  catch(err) {
    next(err);
  }
});

module.exports = router;
