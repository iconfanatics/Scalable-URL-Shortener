const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ------------------- DATABASE CONNECTION -------------------
// নিচের লাইনে আপনার আসল লিংকটি বসিয়ে দেবেন
const MONGO_URI = 'mongodb+srv://mydbuser:myPass123@cluster0.andcmdq.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Could not connect to MongoDB', err));

// ------------------- SCHEMA & MODEL -------------------
const urlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true }
});
const Url = mongoose.model('Url', urlSchema);

// ------------------- ROUTES -------------------
// API: URL Shorten করার জন্য
app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  
  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const shortCode = nanoid(8);
  
  try {
    // ডেটাবেসে সেভ করা
    const newUrl = new Url({ shortCode, longUrl });
    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:3000/${shortCode}`,
      shortCode: shortCode
    });
  } catch (error) {
    res.status(500).json({ error: 'Error saving to database' });
  }
});

// Route: ছোট লিংক ক্লিক করলে আসল লিংকে রিডাইরেক্ট করা
app.get('/:code', async (req, res) => {
  const { code } = req.params;
  
  try {
    // ডেটাবেস থেকে খোঁজা
    const urlData = await Url.findOne({ shortCode: code });

    if (urlData) {
      res.redirect(urlData.longUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});