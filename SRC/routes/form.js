// const express = require('express');
// const router = express.Router();
// const upload = require('../upload');
// const { handleFormSubmission } = require('../formController.js');




// router.post('/submit-form', upload.array('files'), handleFormSubmission);

// module.exports = router;


// SRC/routes/form.js
const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require('./upload');

// Basic form submission handler with file upload
router.post('/submit-form', upload.single('document'), (req, res) => {
  const { name, email } = req.body;
  const file = req.file;

  if (!name || !email || !file) {
    return res.status(400).json({ message: "All fields and a file are required" });
  }

  res.status(200).json({
    message: "Form submitted successfully",
    data: {
      name,
      email,
      file: file.filename
    }
  });
});

module.exports = router;

