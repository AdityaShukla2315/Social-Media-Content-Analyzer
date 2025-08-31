import React, { useState, useEffect } from 'react';
import { BarChart3, Upload, FileText, Image, Sun, Moon } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useTheme } from '../hooks/useTheme';
import { healthCheck } from '../services/api';

const Header = () => {
  const { clearResults } = useAppState();
  const { isDark, toggleTheme } = useTheme();
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await healthCheck();
        setApiStatus('online');
      } catch (error) {
        setApiStatus('offline');
      }
    };
    
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={clearResults}
            title="Click to start new analysis"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Content Analyzer</h1>
              <p className="text-sm text-gray-600">AI-Powered Social Media Optimization</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Image className="w-4 h-4" />
              <span>OCR</span>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="btn-theme"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' ? 'bg-green-500' : 
                apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span>API Status: {apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Checking...'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;