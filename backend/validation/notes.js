const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// validateNoteInput is a combination Express middleware that uses the check
// middleware to validate the keys in the body of the request to create/edit
// a note
const validateNoteInput = [
  check('text')
    .exists({ checkFalsy: true })
    .isLength({ min: 5, max: 140 })
    .withMessage('Note must be between 5 and 140 characters'),
  handleValidationErrors
];

module.exports = validateNoteInput;
