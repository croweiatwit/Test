
// // SRC/server.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');

// const authRoutes = require('./routes/auth');
// const formRoutes = require('./routes/form');

// const app = express();
// const PORT = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Serve static files
// app.use(express.static('public'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Mount API routes
// app.use('/api', authRoutes);
// app.use('/', formRoutes);

// // Serve the login page as default route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/Login_Page.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



// // working server
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/form');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔽 MESSENGER API ROUTE
app.get('/api/users', (req, res) => {
  const usersPath = path.join(__dirname, 'data/users.json');

  console.log('[DEBUG] Looking for:', usersPath);

  if (!fs.existsSync(usersPath)) {
    console.error('[ERROR] File not found:', usersPath);
    return res.status(500).json({ error: 'users.json not found' });
  }

  try {
    const rawData = fs.readFileSync(usersPath, 'utf-8');
    const users = JSON.parse(rawData);

    const safeUsers = users
      .filter(u => u.username && u.email && u.fullName)
      .map(({ email, username, fullName }) => ({
        email,
        username,
        fullName
      }));

    console.log(`[DEBUG] Returning ${safeUsers.length} users`);
    res.json(safeUsers);
  } catch (err) {
    console.error('[ERROR] Failed to read/parse users.json:', err.message);
    res.status(500).json({ error: 'Failed to parse users file' });
  }
});


// Mount API routes
app.use('/api', authRoutes);
app.use('/', formRoutes);

// Serve login page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Login_Page.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});






// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { Low } = require('lowdb');
// const { JSONFile } = require('lowdb/node');
// const path = require('path');
// const fs = require('fs');

// const authRoutes = require('./routes/auth');
// const formRoutes = require('./routes/form');

// const app = express();
// const PORT = 3000;

// // Ensure ./data directory and db file exist
// const dataDir = path.join(__dirname, 'data');
// const dbFile = path.join(dataDir, 'db.json');
// if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
// if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], messages: [] }, null, 2));

// // Set up LowDB
// const db = new Low(new JSONFile(dbFile));
// async function initializeDB() {
//   await db.read();
//   db.data ||= { users: [], messages: [] };
//   await db.write();
// }
// initializeDB();

// // Middleware
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // --- USERS API ---

// // Get all users
// app.get('/api/users', async (req, res) => {
//   await db.read();
//   const users = db.data.users || [];
//   res.json(users.map(({ id, username, email }) => ({ id, username, email })));
// });

// // Add a new user
// app.post('/api/users', async (req, res) => {
//   const { username, email } = req.body;
//   console.log('[DEBUG] Add user request:', req.body);

//   if (!username || !email) {
//     return res.status(400).json({ error: 'Missing username or email' });
//   }

//   await db.read();
//   const exists = db.data.users.find(u => u.email === email || u.username === username);
//   if (exists) {
//     return res.status(409).json({ error: 'User already exists' });
//   }

//   const newUser = { id: Date.now().toString(), username, email };
//   db.data.users.push(newUser);
//   await db.write();

//   console.log('[DEBUG] User saved:', newUser);
//   res.status(201).json({ id: newUser.id });
// });

// // --- MESSAGES API ---

// // Get conversation between two users
// app.get('/api/messages', async (req, res) => {
//   const { user1, user2 } = req.query;
//   if (!user1 || !user2) return res.status(400).json({ error: 'Missing user1 or user2' });

//   await db.read();
//   const messages = db.data.messages.filter(
//     m => (m.senderId === user1 && m.receiverId === user2) ||
//          (m.senderId === user2 && m.receiverId === user1)
//   );

//   res.json(messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
// });

// // Post a new message
// app.post('/api/messages', async (req, res) => {
//   const { senderId, receiverId, text } = req.body;
//   console.log('[DEBUG] New message payload:', req.body);

//   if (!senderId || !receiverId || !text) {
//     console.log('[ERROR] Missing fields');
//     return res.status(400).json({ error: 'Missing senderId, receiverId, or text' });
//   }

//   await db.read();
//   const newMsg = {
//     id: Date.now().toString(),
//     senderId,
//     receiverId,
//     text,
//     timestamp: new Date().toISOString()
//   };

//   db.data.messages.push(newMsg);
//   await db.write();

//   console.log('[DEBUG] Message saved:', newMsg);
//   res.status(201).json({ id: newMsg.id });
// });

// // --- MOUNT OTHER ROUTES ---
// app.use('/api', authRoutes);
// app.use('/', formRoutes);

// // --- FALLBACK ROUTE ---
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/Login_Page.html'));
// });

// // --- START SERVER ---
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
