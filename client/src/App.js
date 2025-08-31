import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ContentAnalysis from './components/ContentAnalysis';
import { useAppState } from './hooks/useAppState';

function App() {
  const { extractedText, analysisResult, isLoading, setExtractedText, setAnalysisResult, setIsLoading } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 AI-Powered Content Analysis
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              Social Media Content Analyzer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transform your content with AI insights. Upload documents or paste text to get instant engagement optimization suggestions.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                true ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              } font-semibold`}>
                1
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded">
                <div className={`h-full rounded transition-all duration-500 ${
                  extractedText ? 'bg-blue-500 w-full' : 'bg-gray-200 w-0'
                }`}></div>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                extractedText ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              } font-semibold`}>
                2
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded">
                <div className={`h-full rounded transition-all duration-500 ${
                  analysisResult ? 'bg-blue-500 w-full' : 'bg-gray-200 w-0'
                }`}></div>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                analysisResult ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              } font-semibold`}>
                3
              </div>
            </div>
          </div>

          {/* Step Labels */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-20 text-sm">
              <span className="text-blue-600 dark:text-blue-400 font-medium">Upload Content</span>
              <span className={extractedText ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400 dark:text-gray-500'}>Analyze Text</span>
              <span className={analysisResult ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-500'}>Get Results</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Step 1: File Upload */}
            {!extractedText && (
              <div className="transform transition-all duration-500 hover:scale-[1.02]">
                <FileUpload />
              </div>
            )}

            {/* Step 2: Content Analysis */}
            {extractedText && !analysisResult && (
              <div className="transform transition-all duration-500 hover:scale-[1.02]">
                <ContentAnalysis />
              </div>
            )}

            {/* Extracted Text Preview */}
            {extractedText && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    📄 Extracted Content
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{extractedText.length} characters</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto border dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {extractedText}
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div id="loading-section" className="text-center py-12">
                <div className="inline-flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Analyzing your content...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few seconds</p>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {analysisResult && (
              <div id="results-section" className="transform transition-all duration-500">
                <AnalysisResults result={analysisResult} />
                
                {/* New Analysis Button */}
                <div className="text-center mt-12">
                  <button
                    onClick={() => {
                      setExtractedText('');
                      setAnalysisResult(null);
                      setIsLoading(false);
                    }}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Analyze New Content</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const AnalysisResults = ({ result }) => {
  console.log('Analysis Result:', result); // Debug log
  
  if (!result) return null;
  
  // Handle both result.analysis and result.data.analysis formats
  let analysis = result.analysis || result.data?.analysis || result.data;
  
  // If analysis has rawAnalysis, try to parse it
  if (analysis?.rawAnalysis && typeof analysis.rawAnalysis === 'string') {
    try {
      // Remove markdown code blocks and parse JSON
      const cleanedJson = analysis.rawAnalysis.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.log('Failed to parse rawAnalysis:', parseError);
    }
  }
  
  if (!analysis) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Analysis Result</h3>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  }

  // If analysis exists but doesn't have expected structure, show raw analysis
  if (!analysis.contentAnalysis && !analysis.engagementMetrics && !analysis.improvementSuggestions && !analysis.bestPractices) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold mb-4">
            ✅ Analysis Complete!
          </div>
          <p className="text-gray-600">Here are your personalized content optimization insights</p>
        </div>
        
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📊 AI Analysis Result</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-6 py-3 rounded-full text-lg font-semibold mb-4">
          ✅ Analysis Complete!
        </div>
        <p className="text-gray-600 dark:text-gray-300">Here are your personalized content optimization insights</p>
      </div>

      {analysis.contentAnalysis && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            📊 Content Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4">
              <div className="text-2xl mb-2">🎭</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Tone</h4>
              <p className="text-blue-700 dark:text-blue-300 font-medium">{analysis.contentAnalysis.tone}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4">
              <div className="text-2xl mb-2">💭</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Sentiment</h4>
              <p className="text-green-700 dark:text-green-300 font-medium">{analysis.contentAnalysis.sentiment}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-4">
              <div className="text-2xl mb-2">📖</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Readability</h4>
              <p className="text-purple-700 dark:text-purple-300 font-medium">{analysis.contentAnalysis.readability}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-4">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Word Count</h4>
              <p className="text-orange-700 dark:text-orange-300 font-medium">{analysis.contentAnalysis.wordCount}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800 rounded-xl p-4">
              <div className="text-2xl mb-2">⏱️</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Read Time</h4>
              <p className="text-pink-700 dark:text-pink-300 font-medium">{analysis.contentAnalysis.estimatedReadTime}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-xl p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Target Audience</h4>
              <p className="text-indigo-700 dark:text-indigo-300 font-medium">{analysis.contentAnalysis.targetAudience}</p>
            </div>
          </div>
        </div>
      )}

      {analysis.engagementMetrics && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            📈 Engagement Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(analysis.engagementMetrics).map(([key, value]) => (
              <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h4 className="font-semibold text-gray-900 capitalize mb-3 text-lg">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-700 leading-relaxed">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.improvementSuggestions && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            💡 Improvement Suggestions
          </h3>
          <div className="space-y-8">
            {analysis.improvementSuggestions.headline && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                  📰 Headline Suggestions
                </h4>
                <div className="space-y-3">
                  {analysis.improvementSuggestions.headline.map((suggestion, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200 hover:shadow-md transition-all duration-300">
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.improvementSuggestions.hashtags && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                  #️⃣ Hashtag Suggestions
                </h4>
                <div className="flex flex-wrap gap-3">
                  {analysis.improvementSuggestions.hashtags.map((hashtag, index) => (
                    <span key={index} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 cursor-pointer">
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.improvementSuggestions.content && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                  ✨ Content Improvements
                </h4>
                <div className="space-y-3">
                  {analysis.improvementSuggestions.content.map((suggestion, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-all duration-300">
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {analysis.bestPractices && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            🎯 Best Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-bold text-green-700 dark:text-green-300 mb-4 flex items-center text-xl">
                ✅ Do's
              </h4>
              <div className="space-y-3">
                {analysis.bestPractices.dos?.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
              <h4 className="font-bold text-red-700 dark:text-red-300 mb-4 flex items-center text-xl">
                ❌ Don'ts
              </h4>
              <div className="space-y-3">
                {analysis.bestPractices.donts?.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;