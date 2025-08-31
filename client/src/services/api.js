import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// PDF Extraction
export const extractPDFText = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post('/pdf/extract', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// OCR Extraction
export const extractOCRText = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/ocr/extract', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Multiple OCR Extraction
export const extractMultipleOCRText = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/ocr/extract-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Content Analysis
export const analyzeContent = async (text, contentType = 'social-media', platform = 'general') => {
  const response = await api.post('/analysis/analyze', {
    text,
    contentType,
    platform,
  });

  return response.data;
};

// Quick Analysis
export const quickAnalyzeContent = async (text) => {
  const response = await api.post('/analysis/quick-analyze', {
    text,
  });

  return response.data;
};

// Get Social Media Tips
export const getSocialMediaTips = async () => {
  const response = await api.get('/analysis/tips');
  return response.data;
};

// Get Supported Formats
export const getSupportedFormats = async () => {
  const [pdfFormats, ocrFormats] = await Promise.all([
    api.get('/pdf/supported-formats'),
    api.get('/ocr/supported-formats'),
  ]);

  return {
    pdf: pdfFormats.data,
    ocr: ocrFormats.data,
  };
};

// Health Check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;