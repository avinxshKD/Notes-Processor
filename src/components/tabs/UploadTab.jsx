import { useState, useCallback } from 'react';
import { FiUpload, FiFileText, FiX } from 'react-icons/fi';
import { useApp } from '../../contexts/AppContext';
import { parsePDF, isPDF, formatFileSize } from '../../utils/pdfParser';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';

export default function UploadTab() {
  const { notesText, setNotesText } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file) => {
    setError('');
    
    if (!isPDF(file)) {
      setError('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    try {
      const text = await parsePDF(file);
      if (text.trim().length === 0) {
        setError('No text found in PDF. Please try a different file.');
        return;
      }
      setNotesText(text);
    } catch (err) {
      setError(err.message || 'Failed to parse PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const clearNotes = () => {
    setNotesText('');
    setFileName('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add your notes
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Drop a PDF here or just paste your text below
        </p>
      </div>

      {/* PDF Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }
        `}
      >
        {isLoading ? (
          <LoadingSpinner size="lg" text="Parsing PDF..." />
        ) : fileName ? (
          <div className="space-y-4">
            <FiFileText className="text-5xl text-blue-600 mx-auto" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{fileName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notesText.length} characters extracted
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={clearNotes} icon={<FiX />}>
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <FiUpload className="text-5xl text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drag & drop your PDF here
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                or click to browse
              </p>
            </div>
            <label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="inline-block">
                <Button as="span" icon={<FiUpload />}>
                  Choose PDF File
                </Button>
              </span>
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Text Area */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Or paste your notes here
        </label>
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Paste your study notes here..."
          className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-none"
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-500">
          {notesText.length} characters
        </div>
      </div>

      {notesText && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ✓ Got it! Head over to the other tabs to create summaries, flashcards, or take a quiz.
          </p>
        </div>
      )}
    </div>
  );
}
