const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// আপাতত ডেটা মেমোরিতে রাখছি (Database এর কাজ)
const urlDatabase = {};

// API: URL Shorten করার জন্য
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  
  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const shortCode = nanoid(8); // ৮ অক্ষরের একটি ইউনিক কোড তৈরি হবে
  urlDatabase[shortCode] = longUrl;

  res.json({
    shortUrl: `http://localhost:3000/${shortCode}`,
    shortCode: shortCode
  });
});

// Route: ছোট লিংক ক্লিক করলে আসল লিংকে রিডাইরেক্ট করা
app.get('/:code', (req, res) => {
  const { code } = req.params;
  const longUrl = urlDatabase[code];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});