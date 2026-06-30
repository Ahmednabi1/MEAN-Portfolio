const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {createMessage,getMessages,markAsRead,deleteMessage} = require('../controllers/messageController');

router.post('/', createMessage);        // public
router.get('/', protect, getMessages);          // admin
router.put('/:id', protect, markAsRead);           // admin
router.delete('/:id', protect, deleteMessage);     // admin

module.exports = router;