const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/pdf/extract - Extract text from PDF
router.post('/extract', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse PDF content
    const pdfData = await pdfParse(dataBuffer);
    
    // Extract text content
    const extractedText = pdfData.text;
    const pageCount = pdfData.numpages;
    const info = pdfData.info;

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      data: {
        fileName,
        extractedText,
        pageCount,
        info,
        characterCount: extractedText.length,
        wordCount: extractedText.split(/\s+/).filter(word => word.length > 0).length
      }
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to extract text from PDF',
      message: error.message
    });
  }
});

// GET /api/pdf/supported-formats - Get supported file formats
router.get('/supported-formats', (req, res) => {
  res.json({
    supportedFormats: ['application/pdf'],
    maxFileSize: '10MB',
    features: [
      'Text extraction with formatting preservation',
      'Page count detection',
      'Document metadata extraction',
      'Character and word count'
    ]
  });
});

module.exports = router;
