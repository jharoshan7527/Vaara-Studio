
const express = require('express');
const auth = require('../middleware/auth');
const Inquiry = require('../models/Inquiry');
const Service = require('../models/Service');
const router = express.Router();

// Admin only: list inquiries
router.get('/inquiries', auth('admin'), async (req, res) => {
  const items = await Inquiry.find().sort({ createdAt: -1 });
  res.json(items);
});

// Admin only: list services
router.get('/services', auth('admin'), async (req, res) => {
  const items = await Service.find().sort({ createdAt: -1 });
  res.json(items);
});

module.exports = router;
