const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', async (req, res) => {
  const chathistory = await Message.find({});
  res.status(200).json(chathistory);
});

module.exports = router;