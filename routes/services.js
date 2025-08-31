
const express = require('express');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const router = express.Router();

// Public: list services
router.get('/', async (req, res) => {
  const q = {};
  if (req.query.category) q.category = req.query.category;
  const items = await Service.find(q).sort({ createdAt: -1 });
  res.json(items);
});

// Public: get one
router.get('/:id', async (req, res) => {
  const item = await Service.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// Provider/Admin: create
router.post('/', auth(), async (req, res) => {
  try {
    const payload = { ...req.body, provider: req.user.id };
    const created = await Service.create(payload);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Provider/Admin: update
router.put('/:id', auth(), async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Provider/Admin: delete
router.delete('/:id', auth(), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
