import { useState } from 'react';
import { FiSave, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { useApp } from '../../contexts/AppContext';
import { testAPIKey } from '../../utils/openai';
import Button from '../Button';
import Card from '../Card';

export default function SettingsTab({ showToast }) {
  const { apiKey, setApiKey, clearAllData } = useApp();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = () => {
    setApiKey(tempApiKey);
    setTestResult(null);
    showToast('API key saved successfully!', 'success');
  };

  const handleTest = async () => {
    if (!tempApiKey) {
      showToast('Please enter an API key first', 'warning');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const isValid = await testAPIKey(tempApiKey);
      setTestResult(isValid);
      
      if (isValid) {
        showToast('API key is valid!', 'success');
      } else {
        showToast('API key is invalid', 'error');
      }
    } catch (error) {
      setTestResult(false);
      showToast('Failed to test API key', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
      showToast('All data cleared successfully', 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add your API key here to make things work
        </p>
      </div>

      {/* API Key Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your API Key
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Test Result */}
          {testResult !== null && (
            <div className={`
              flex items-center gap-2 p-3 rounded-lg
              ${testResult 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }
            `}>
              {testResult ? <FiCheck /> : <FiX />}
              <span className="text-sm">
                {testResult ? 'API key is valid and working!' : 'API key is invalid or expired'}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleTest}
              disabled={isTesting || !tempApiKey}
              variant="outline"
            >
              {isTesting ? 'Testing...' : 'Test API Key'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={tempApiKey === apiKey}
              icon={<FiSave />}
            >
              Save API Key
            </Button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <p className="font-medium mb-1">Heads up</p>
                <p>
                  Your key stays in your browser - it's not sent anywhere except directly to OpenAI when you use the features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* How to Get API Key */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Don't have a key yet? Here's how:
        </h3>
        <ol className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">1.</span>
            <span>Head over to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com/api-keys</a></span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">2.</span>
            <span>Log in (or make an account if you're new)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">3.</span>
            <span>Hit the "Create new secret key" button</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">4.</span>
            <span>Copy it and paste it in the box above - done!</span>
          </li>
        </ol>
      </Card>

      {/* Data Management */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Start Fresh?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This nukes everything - your notes, summaries, flashcards, quiz scores... all of it. 
          Only click this if you're really sure!
        </p>
        <Button variant="danger" onClick={handleClearData}>
          Clear All Data
        </Button>
      </Card>

      {/* About */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          What's This?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          StudyAI is basically your study buddy that never gets tired. 
          Throw your notes at it and it'll spit out summaries, flashcards, and quizzes to help you actually remember stuff.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          v1.0.0 • Runs on OpenAI GPT-3.5
        </p>
      </Card>
    </div>
  );
}
