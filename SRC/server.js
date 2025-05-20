// Get  path to here:
// Put photos in bucket would be cheaper
// image in object stoge.
// best latency
// use library
// bucket == blob


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// File paths
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Upload directory setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For JSON payloads
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/api/login', handleLogin);


//
// --- FORM SUBMISSION ROUTE ---
//
app.post('/submit-form', upload.single('photo'), (req, res) => {
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
        return res.status(500).send('Server Error');
      }
      res.send('Form and photo submitted successfully');
    });
  });
});

//
// --- SIGNUP ROUTE ---
//
function handleSignup(req, res) {
  const { email, password, username, fullName } = req.body;
  if (!email || !password || !username || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ email, password, username, fullName });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.status(201).json({ message: "Signup successful" });
}
app.post('/api/signup', handleSignup);

//
// --- LOGIN ROUTE ---
//
function handleLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username/email and password required" });
  }

  if (!fs.existsSync(USERS_FILE)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const user = users.find(u =>
    (u.username === username || u.email === username) &&
    u.password === password
  );

  if (user) {
    return res.status(200).json({
      message: "Login successful!!!!!",
      user: { fullName: user.fullName }
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}
app.post('/api/login', handleLogin);


//
// --- SERVE LOGIN PAGE BY DEFAULT ---
//
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Login_Page.html'));
});

//
// --- START SERVER ---
//
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
