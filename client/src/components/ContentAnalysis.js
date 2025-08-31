import React, { useState } from 'react';
import { BarChart3, Send, Sparkles, Target, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppState } from '../hooks/useAppState';
import { analyzeContent, quickAnalyzeContent } from '../services/api';

const ContentAnalysis = () => {
  const { extractedText, setAnalysisResult, setIsLoading } = useAppState();
  const [manualText, setManualText] = useState('');
  const [contentType, setContentType] = useState('social-media');
  const [platform, setPlatform] = useState('general');
  const [analysisType, setAnalysisType] = useState('full');

  const handleAnalyze = async () => {
    const textToAnalyze = manualText || extractedText;
    
    if (!textToAnalyze.trim()) {
      toast.error('Please provide text content to analyze');
      return;
    }

    setIsLoading(true);

    try {
      let result;
      
      if (analysisType === 'quick') {
        result = await quickAnalyzeContent(textToAnalyze);
      } else {
        result = await analyzeContent(textToAnalyze, contentType, platform);
      }

      setAnalysisResult(result);
      toast.success('Content analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExtractedText = () => {
    if (extractedText) {
      setManualText(extractedText);
      toast.success('Extracted text loaded for analysis');
    } else {
      toast.error('No extracted text available');
    }
  };

  const clearText = () => {
    setManualText('');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Content Analysis</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Analysis Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="full"
                checked={analysisType === 'full'}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Full Analysis</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="quick"
                checked={analysisType === 'quick'}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Quick Analysis</span>
            </label>
          </div>
        </div>

        {analysisType === 'full' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="input-field"
                aria-label="Content type"
              >
                <option value="social-media">Social Media Post</option>
                <option value="blog">Blog Post</option>
                <option value="article">Article</option>
                <option value="newsletter">Newsletter</option>
                <option value="advertisement">Advertisement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="input-field"
                aria-label="Platform"
              >
                <option value="general">General</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content to Analyze
            </label>
            <div className="flex space-x-2">
              {extractedText && (
                <button
                  onClick={handleUseExtractedText}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Use Extracted Text
                </button>
              )}
              <button
                onClick={clearText}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Enter your content here or upload a document to extract text..."
            className="input-field h-32 resize-none"
            rows={6}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {manualText.length} characters
            </span>
            {manualText.length > 4000 && (
              <span className="text-xs text-orange-600 dark:text-orange-400">
                Text will be truncated for analysis
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!manualText.trim() && !extractedText}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BarChart3 className="w-5 h-5" />
          <span>
            {analysisType === 'quick' ? 'Quick Analyze' : 'Analyze Content'}
          </span>
        </button>
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">
          Analysis Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-900">AI-Powered Insights</h4>
              <p className="text-sm text-primary-700">
                Get detailed analysis of tone, sentiment, and engagement potential
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-900">Platform Optimization</h4>
              <p className="text-sm text-primary-700">
                Tailored suggestions for different social media platforms
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-900">Audience Targeting</h4>
              <p className="text-sm text-primary-700">
                Identify your target audience and optimize content accordingly
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Send className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-900">Actionable Tips</h4>
              <p className="text-sm text-primary-700">
                Get specific recommendations to improve engagement rates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalysis;