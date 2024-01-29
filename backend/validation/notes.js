const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// validateNoteInput is a combination Express middleware that uses the check
// middleware to validate the keys in the body of the request to create/edit
// a note
const validateNoteInput = [
  check('text')
    .exists({ checkFalsy: true })
    .isLength({ min: 6})
    .withMessage('Note must be at least 6 characters long'),
  handleValidationErrors
];

module.exports = validateNoteInput;
