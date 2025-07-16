// const fs = require('fs');
// const path = require('path');

// const SUBMISSIONS_FILE = path.join(__dirname, '../data/submissions.json');

// function handleFormSubmission(req, res) {
//   const formData = req.body;

// if (req.files && req.files.length > 0) {
//   formData.photoPaths = req.files.map(f => `/uploads/${f.filename}`);
// }


//   fs.readFile(SUBMISSIONS_FILE, 'utf8', (err, data) => {
//     let submissions = [];

//     if (!err && data) {
//       try {
//         submissions = JSON.parse(data);
//       } catch (parseErr) {
//         console.error('Error parsing JSON:', parseErr);
//       }
//     }

//     submissions.push(formData);

//     fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), writeErr => {
//       if (writeErr) {
//         console.error('Error writing file:', writeErr);
//         return res.status(500).json({ message: 'Server Error' });
//       }

//       res.status(200).json({ redirect: '/Home_Page.html' });
//     });
//   });
// }

// module.exports = {
//   handleFormSubmission
// };

//
// --- FORM SUBMISSION ROUTE ---
//
app.post('/submit-form', upload.single('image'), (req, res) => {


  const formData = req.body;

  if (req.file) {
    formData.photoPath = `/uploads/${req.file.filename}`;
  }

  fs.readFile(SUBMISSIONS_FILE, 'utf8', (err, data) => {
    let submissions = [];

    if (!err && data) {
      try {
        submissions = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
      }
    }

    submissions.push(formData);

    fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), writeErr => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
        return res.status(500).json({ message: 'Server Error' });
      }

      // ✅ Return redirect path in JSON
      res.status(200).json({ redirect: '/Home_page.html' });
    });
  });
});