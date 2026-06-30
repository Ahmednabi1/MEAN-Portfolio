const Message = require('../models/Message');

// Public
// POST /api/messages
// Body: { name, email, message }
async function createMessage(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const msg = await Message.create({ name, email, message });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

// Protected
// GET /api/messages
// GET /api/messages/:id
async function getMessages(req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

// Protected
async function markAsRead(req, res) {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });

    if (!msg) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

// Protected
// DELETE /api/messages/:id
async function deleteMessage(req, res) {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);

    if (!msg) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { createMessage, getMessages, markAsRead, deleteMessage };