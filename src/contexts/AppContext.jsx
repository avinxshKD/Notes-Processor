import { createContext, useContext, useState, useEffect } from 'react';
import { load, save } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => load('api_key', ''));
  const [notesText, setNotesText] = useState(() => load('notes_text', ''));
  const [summary, setSummary] = useState(() => load('summary', ''));
  const [flashcards, setFlashcards] = useState(() => load('flashcards', []));
  const [flashcardProgress, setFlashcardProgress] = useState(() => load('flashcard_progress', {}));
  const [quizHistory, setQuizHistory] = useState(() => load('quiz_history', []));
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('upload');

  // persist everything in one shot
  useEffect(() => {
    save('api_key', apiKey);
    save('notes_text', notesText);
    save('summary', summary);
    save('flashcards', flashcards);
    save('flashcard_progress', flashcardProgress);
    save('quiz_history', quizHistory);
  }, [apiKey, notesText, summary, flashcards, flashcardProgress, quizHistory]);

  const updateFlashcardProgress = (cardIndex, status) => {
    setFlashcardProgress(prev => ({ ...prev, [cardIndex]: status }));
  };

  const addQuizResult = (result) => {
    setQuizHistory(prev => [result, ...prev].slice(0, 10));
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
