const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/auth/login
// Body: { username, password }
// there's no registeration on purpose the admin data will be provided in the .env file alongside token
// protected --> require token (login)
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,                     //attach the saved token in .env
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }   //long for testing 
    );

    res.json({
      token,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
}

// GET /api/auth/me  (protected) —  for dashboard to check if token is valid or not
async function me(req, res) {
  res.json({ admin: req.admin });
}

module.exports = { login, me };
