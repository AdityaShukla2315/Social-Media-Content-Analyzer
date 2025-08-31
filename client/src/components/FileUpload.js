import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppState } from '../hooks/useAppState';
import { extractPDFText, extractOCRText } from '../services/api';

const FileUpload = () => {
  const { setExtractedText, setIsLoading } = useAppState();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingStatus, setProcessingStatus] = useState({});

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const newFiles = acceptedFiles.filter(
      (file) => !uploadedFiles.some((existing) => existing.name === file.name)
    );

    if (newFiles.length === 0) {
      toast.error('File already uploaded');
      return;
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setIsLoading(true);

    for (const file of newFiles) {
      setProcessingStatus((prev) => ({ ...prev, [file.name]: 'processing' }));

      try {
        let extractedText = '';

        if (file.type === 'application/pdf') {
          const result = await extractPDFText(file);
          extractedText = result.data.extractedText;
          toast.success(`PDF processed: ${file.name}`);
        } else if (file.type.startsWith('image/')) {
          const result = await extractOCRText(file);
          extractedText = result.data.extractedText;
          toast.success(`Image processed: ${file.name}`);
        }

        if (extractedText) {
          setExtractedText(extractedText);
          setProcessingStatus((prev) => ({ ...prev, [file.name]: 'success' }));
        }
      } catch (error) {
        console.error('File processing error:', error);
        setProcessingStatus((prev) => ({ ...prev, [file.name]: 'error' }));
        toast.error(`Failed to process ${file.name}`);
      }
    }

    setIsLoading(false);
  }, [uploadedFiles, setExtractedText, setIsLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true
  });

  const removeFile = (fileName) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setProcessingStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <Image className="w-5 h-5 text-blue-500" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Upload Documents</h2>
        
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                or click to select files
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Supported formats: PDF, PNG, JPG, JPEG, GIF, BMP, TIFF</p>
              <p>Maximum file size: 10MB</p>
            </div>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {processingStatus[file.name] && getStatusIcon(processingStatus[file.name])}
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card bg-blue-50 dark:bg-gray-700 border-blue-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• Upload PDF documents for text extraction</li>
          <li>• Upload images for OCR text recognition</li>
          <li>• Supported image formats: PNG, JPG, GIF, BMP, TIFF</li>
          <li>• Maximum file size: 10MB per file</li>
          <li>• You can upload multiple files at once</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;