const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');

const router = express.Router();

// Configure multer for image uploads
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
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files (JPEG, PNG, GIF, BMP, TIFF) are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/ocr/extract - Extract text from image using OCR
router.post('/extract', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Perform OCR on the image
    const result = await Tesseract.recognize(
      filePath,
      'eng' // English language
    );

    const extractedText = result.data.text;
    const confidence = result.data.confidence;
    const words = result.data.words;
    const lines = result.data.lines;

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      data: {
        fileName,
        extractedText,
        confidence: Math.round(confidence * 100) / 100,
        wordCount: words.length,
        lineCount: lines.length,
        characterCount: extractedText.length,
        words: words.map(word => ({
          text: word.text,
          confidence: Math.round(word.confidence * 100) / 100,
          bbox: word.bbox
        })),
        lines: lines.map(line => ({
          text: line.text,
          confidence: Math.round(line.confidence * 100) / 100,
          bbox: line.bbox
        }))
      }
    });

  } catch (error) {
    console.error('OCR extraction error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to extract text from image',
      message: error.message
    });
  }
});

// POST /api/ocr/extract-multiple - Extract text from multiple images
router.post('/extract-multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }

    const results = [];

    for (const file of req.files) {
      try {
        const result = await Tesseract.recognize(file.path, 'eng');
        
        results.push({
          fileName: file.originalname,
          success: true,
          extractedText: result.data.text,
          confidence: Math.round(result.data.confidence * 100) / 100,
          wordCount: result.data.words.length,
          characterCount: result.data.text.length
        });

        // Clean up file
        fs.unlinkSync(file.path);
      } catch (error) {
        results.push({
          fileName: file.originalname,
          success: false,
          error: error.message
        });

        // Clean up file if it exists
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    res.json({
      success: true,
      data: {
        totalFiles: req.files.length,
        successfulExtractions: results.filter(r => r.success).length,
        failedExtractions: results.filter(r => !r.success).length,
        results
      }
    });

  } catch (error) {
    console.error('Multiple OCR extraction error:', error);
    
    // Clean up all files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      error: 'Failed to process multiple images',
      message: error.message
    });
  }
});

// GET /api/ocr/supported-formats - Get supported image formats
router.get('/supported-formats', (req, res) => {
  res.json({
    supportedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'],
    maxFileSize: '10MB',
    maxFilesPerRequest: 5,
    features: [
      'Optical Character Recognition (OCR)',
      'Multi-language support (English by default)',
      'Confidence scoring',
      'Word and line-level extraction',
      'Bounding box information',
      'Batch processing support'
    ]
  });
});

module.exports = router;
