import { useState, createContext, useContext } from 'react';

const AppStateContext = createContext(undefined);

export const AppStateProvider = ({ children }) => {
  const [extractedText, setExtractedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearResults = () => {
    setExtractedText('');
    setAnalysisResult(null);
    setIsLoading(false);
  };

  const value = {
    extractedText,
    analysisResult,
    isLoading,
    setExtractedText,
    setAnalysisResult,
    setIsLoading,
    clearResults,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};