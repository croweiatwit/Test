// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadsDir),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });

// module.exports = multer({
//   storage: storage,
//   limits: {
//     files: 10,
//     fileSize: 5 * 1024 * 1024
//   }
// });


// SRC/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

module.exports = multer({
  storage: storage,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});


