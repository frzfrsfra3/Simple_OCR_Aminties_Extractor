const express = require('express');
const multer = require('multer');
const path = require('path');
const { createWorker } = require('tesseract.js');
const app = express();

// Simple storage configuration
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { amenities: null, imagePath: null });
});

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    console.log('Starting OCR...');
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();
    
    const amenities = processAmenities(text);
    res.render('index', { 
      amenities: amenities, 
      imagePath: null // Skip image display for now
    });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).send('OCR Processing Failed');
  }
});

function processAmenities(text) {
  const amenityKeywords = [
    'wifi', 'pool', 'gym', 3, 'open',0,7,5,'house','HOUSE', 'comission','RESORT','parking', 'restaurant',
    'spa', 'bar','beach', 'breakfast', 'laundry', 'air conditioning'
  ];
  
  const found = [];
  const lowerText = text.toLowerCase();
  
  amenityKeywords.forEach(amenity => {
    if (lowerText.includes(amenity)) {
      found.push(amenity);
    }
  });
  
  return found;
}

app.listen(4000, () => console.log('Server running on http://localhost:4000'));