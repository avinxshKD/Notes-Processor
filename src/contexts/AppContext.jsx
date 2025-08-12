import { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => getFromLocalStorage(STORAGE_KEYS.API_KEY, ''));
  const [notesText, setNotesText] = useState(() => getFromLocalStorage(STORAGE_KEYS.NOTES_TEXT, ''));
  const [summary, setSummary] = useState(() => getFromLocalStorage(STORAGE_KEYS.SUMMARY, ''));
  const [flashcards, setFlashcards] = useState(() => getFromLocalStorage(STORAGE_KEYS.FLASHCARDS, []));
  const [flashcardProgress, setFlashcardProgress] = useState(() => 
    getFromLocalStorage(STORAGE_KEYS.FLASHCARD_PROGRESS, {})
  );
  const [quizHistory, setQuizHistory] = useState(() => getFromLocalStorage(STORAGE_KEYS.QUIZ_HISTORY, []));
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('upload');

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.API_KEY, apiKey);
  }, [apiKey]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.NOTES_TEXT, notesText);
  }, [notesText]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SUMMARY, summary);
  }, [summary]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.FLASHCARDS, flashcards);
  }, [flashcards]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.FLASHCARD_PROGRESS, flashcardProgress);
  }, [flashcardProgress]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.QUIZ_HISTORY, quizHistory);
  }, [quizHistory]);

  const updateFlashcardProgress = (cardIndex, status) => {
    setFlashcardProgress(prev => ({
      ...prev,
      [cardIndex]: status
    }));
  };

  const addQuizResult = (result) => {
    setQuizHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 results
  };

  const clearAllData = () => {
    setNotesText('');
    setSummary('');
    setFlashcards([]);
    setFlashcardProgress({});
    setQuizHistory([]);
  };

  const value = {
    apiKey,
    setApiKey,
    notesText,
    setNotesText,
    summary,
    setSummary,
    flashcards,
    setFlashcards,
    flashcardProgress,
    updateFlashcardProgress,
    quizHistory,
    addQuizResult,
    currentView,
    setCurrentView,
    activeTab,
    setActiveTab,
    clearAllData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
