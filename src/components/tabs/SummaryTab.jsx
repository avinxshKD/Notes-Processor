import { useState } from 'react';
import { FiCopy, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useApp } from '../../contexts/AppContext';
import { generateSummary } from '../../utils/openai';
import { exportSummaryAsPDF, copyToClipboard } from '../../utils/export';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import Card from '../Card';

export default function SummaryTab({ showToast }) {
  const { notesText, summary, setSummary, apiKey } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');

  const handleGenerate = async () => {
    if (!notesText) {
      showToast('Please upload or paste your notes first', 'warning');
      return;
    }

    if (!apiKey) {
      showToast('Please set your OpenAI API key in Settings', 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateSummary(notesText, summaryLength, apiKey);
      setSummary(result);
      showToast('Summary generated successfully!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(summary);
    if (success) {
      showToast('Summary copied to clipboard!', 'success');
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleExport = () => {
    try {
      exportSummaryAsPDF(summary);
      showToast('Summary exported as PDF!', 'success');
    } catch (error) {
      showToast('Failed to export PDF', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Summarize your notes
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get the key points without reading everything again
        </p>
      </div>

      {/* Summary Length Options */}
      <Card>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          How detailed?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'short', label: 'Quick', desc: '3-5 points' },
            { value: 'medium', label: 'Normal', desc: '7-10 points' },
            { value: 'detailed', label: 'Detailed', desc: 'Everything' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSummaryLength(option.value)}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${summaryLength === option.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }
              `}
            >
              <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating || !notesText}
          icon={<FiRefreshCw className={isGenerating ? 'animate-spin' : ''} />}
        >
          {isGenerating ? 'Generating...' : summary ? 'Regenerate Summary' : 'Generate Summary'}
        </Button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <Card className="text-center">
          <LoadingSpinner size="lg" text="Generating your summary..." />
        </Card>
      )}

      {/* Summary Display */}
      {summary && !isGenerating && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Summary
            </h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                icon={<FiCopy />}
              >
                Copy
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                icon={<FiDownload />}
              >
                Export PDF
              </Button>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        </Card>
      )}

      {!notesText && !isGenerating && (
        <Card className="text-center text-gray-500 dark:text-gray-400">
          <p>Add some notes first (Upload tab)</p>
        </Card>
      )}
    </div>
  );
}
