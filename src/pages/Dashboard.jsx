import { useState } from 'react';
import { FiUpload, FiFileText, FiLayers, FiHelpCircle, FiSettings, FiMoon, FiSun, FiArrowLeft } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import TabNavigation from '../components/TabNavigation';
import UploadTab from '../components/tabs/UploadTab';
import SummaryTab from '../components/tabs/SummaryTab';
import FlashcardsTab from '../components/tabs/FlashcardsTab';
import QuizTab from '../components/tabs/QuizTab';
import SettingsTab from '../components/tabs/SettingsTab';
import Toast from '../components/Toast';
import Button from '../components/Button';

export default function Dashboard() {
  const { activeTab, setActiveTab, setCurrentView } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const tabs = [
    { id: 'upload', label: 'Upload Notes', icon: <FiUpload /> },
    { id: 'summary', label: 'Summary', icon: <FiFileText /> },
    { id: 'flashcards', label: 'Flashcards', icon: <FiLayers /> },
    { id: 'quiz', label: 'Quiz', icon: <FiHelpCircle /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadTab showToast={showToast} />;
      case 'summary':
        return <SummaryTab showToast={showToast} />;
      case 'flashcards':
        return <FlashcardsTab showToast={showToast} />;
      case 'quiz':
        return <QuizTab showToast={showToast} />;
      case 'settings':
        return <SettingsTab showToast={showToast} />;
      default:
        return <UploadTab showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentView('landing')}
                icon={<FiArrowLeft />}
              >
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notes<span className="text-blue-600">Processor</span>
              </h1>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FiMoon className="text-xl text-gray-700 dark:text-gray-300" />
              ) : (
                <FiSun className="text-xl text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderTabContent()}
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
