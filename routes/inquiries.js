
const express = require('express');
const Inquiry = require('../models/Inquiry');
const router = express.Router();

// Public: create inquiry
router.post('/', async (req, res) => {
  try {
    const created = await Inquiry.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
