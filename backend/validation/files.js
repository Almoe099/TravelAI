const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// validateFileInput is a combination Express middleware that uses the check
// middleware to validate the keys in the body of the request to create/edit
// a file
const validateFileInput = [
  check('content')
    .exists({ checkFalsy: true })
    .withMessage('File must be between 5 and 140 characters'),
  handleValidationErrors
];

module.exports = validateFileInput;