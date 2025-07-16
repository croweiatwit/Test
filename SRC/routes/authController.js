const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

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

// ❗ Export the handlers, don't use app.post here
module.exports = {
  handleSignup,
  handleLogin
};
