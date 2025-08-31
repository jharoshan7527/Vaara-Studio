
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Service = require('./models/Service');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vaara_studio';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  await User.deleteMany({});
  await Service.deleteMany({});

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@vaara.studio',
    passwordHash: await bcrypt.hash('Admin@123', 10),
    role: 'admin'
  });

  const provider = await User.create({
    name: 'Vaara Studio',
    email: 'provider@vaara.studio',
    passwordHash: await bcrypt.hash('Provider@123', 10),
    role: 'provider'
  });

  const services = await Service.insertMany([
    {
      title: '3D Product Modeling',
      category: '3D Modeling',
      description: 'High-quality 3D product models suitable for e-commerce, AR, and animations. Includes up to 2 revisions.',
      priceFrom: 5000,
      provider: provider._id,
      images: ['/images/3d1.jpg']
    },
    {
      title: 'Explainer Animation (30s)',
      category: 'Animation',
      description: 'Short explainer animation with voice-over sync and background music.',
      priceFrom: 8000,
      provider: provider._id,
      images: ['/images/anim1.jpg']
    },
    {
      title: 'Business Website (5 pages)',
      category: 'Web Development',
      description: 'Responsive website with SEO-ready structure, contact form integration, and admin basics.',
      priceFrom: 15000,
      provider: provider._id,
      images: ['/images/web1.jpg']
    }
  ]);

  console.log('Seeded users and services:', { users: 2, services: services.length });
  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(e => { console.error(e); process.exit(1); });
