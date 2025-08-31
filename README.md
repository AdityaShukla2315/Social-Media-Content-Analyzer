# 📊 Social Media Content Analyzer

> AI-powered social media content analysis and optimization tool with document upload, OCR, and intelligent engagement suggestions.

![Project Banner](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js) ![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

## 📸 Project Preview

![Social Media Content Analyzer UI](client/public/Social%20Scan%20.png)

*Modern, responsive interface with dark/light mode support and intuitive step-by-step workflow*

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/AdityaShukla2315/Social-Media-Content-Analyzer.git
cd Social-Media-Content-Analyzer

# Install dependencies
cd server && npm install
cd ../client && npm install

# Setup environment
cp server/.env.example server/.env
# Add your GEMINI_API_KEY to server/.env

# Start development servers
cd server && npm run dev    # Terminal 1
cd client && npm start      # Terminal 2
```

Visit: http://localhost:3000

## ✨ Key Features

- **📄 Document Upload**: PDF files and images (PNG, JPG, GIF, BMP, TIFF)
- **🔍 Text Extraction**: Advanced PDF parsing and OCR technology
- **🤖 AI Analysis**: Google Gemini integration for intelligent insights
- **📈 Engagement Optimization**: Platform-specific suggestions
- **🎨 Modern UI**: Responsive design with dark/light mode
- **⚡ Real-time Processing**: Live status updates and progress tracking

## 🛠️ Technology Stack

**Frontend**: React 18, Tailwind CSS, Lucide Icons, React Dropzone  
**Backend**: Node.js, Express, Multer, PDF-Parse, Tesseract.js  
**AI**: Google Gemini API  
**Security**: Helmet.js, Rate Limiting, CORS Protection

## 📖 Documentation

For detailed setup instructions, API documentation, and usage guide, see [docs/README.md](docs/README.md)

## 🧪 Testing

Use the provided sample data:
- **PDF**: `docs/Monthly Social Media Engagement Report.pdf`
- **Text**: `docs/test-content.txt`

## 🚀 Deployment

Ready for deployment on Vercel, Netlify, Heroku, Railway, or any cloud platform.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

⭐ **Star this repository if you found it helpful!**