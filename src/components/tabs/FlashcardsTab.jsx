import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload, FiCheck, FiClock } from 'react-icons/fi';
import { useApp } from '../../contexts/AppContext';
import { generateFlashcards } from '../../utils/openai';
import { exportFlashcardsAsCSV } from '../../utils/export';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import Card from '../Card';

export default function FlashcardsTab({ showToast }) {
  const { notesText, flashcards, setFlashcards, flashcardProgress, updateFlashcardProgress, apiKey } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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
      const cards = await generateFlashcards(notesText, apiKey);
      setFlashcards(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      showToast(`${cards.length} flashcards generated!`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsLearned = () => {
    updateFlashcardProgress(currentIndex, 'learned');
    showToast('Marked as learned!', 'success');
    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => handleNext(), 500);
    }
  };

  const markForReview = () => {
    updateFlashcardProgress(currentIndex, 'review');
    showToast('Marked for review', 'info');
    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => handleNext(), 500);
    }
  };

  const handleExport = () => {
    try {
      exportFlashcardsAsCSV(flashcards);
      showToast('Flashcards exported as CSV!', 'success');
    } catch (error) {
      showToast('Failed to export flashcards', 'error');
    }
  };

  const currentCard = flashcards[currentIndex];
  const cardStatus = flashcardProgress[currentIndex];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Flashcards
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Click cards to flip them. Mark what you know.
        </p>
      </div>

      {/* Generate/Export Buttons */}
      {!flashcards.length && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating || !notesText}
            icon={<FiRefreshCw className={isGenerating ? 'animate-spin' : ''} />}
          >
            {isGenerating ? 'Generating...' : 'Generate Flashcards'}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card className="text-center">
          <LoadingSpinner size="lg" text="Creating flashcards..." />
        </Card>
      )}

      {/* Flashcard Display */}
      {flashcards.length > 0 && !isGenerating && (
        <>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress: {currentIndex + 1} / {flashcards.length}</span>
              <span>
                Learned: {Object.values(flashcardProgress).filter(s => s === 'learned').length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div
            onClick={handleFlip}
            className={`flip-card cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            style={{ minHeight: '300px' }}
          >
            <div className="flip-card-inner">
              {/* Front */}
              <Card className="flip-card-front">
                <div className="flex flex-col items-center justify-center min-h-[250px] text-center">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">
                    QUESTION
                  </div>
                  <p className="text-xl text-gray-900 dark:text-white px-4">
                    {currentCard.question}
                  </p>
                  <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    Click to reveal answer
                  </div>
                </div>
              </Card>

              {/* Back */}
              <Card className="flip-card-back">
                <div className="flex flex-col items-center justify-center min-h-[250px] text-center">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-4">
                    ANSWER
                  </div>
                  <p className="text-lg text-gray-900 dark:text-white px-4">
                    {currentCard.answer}
                  </p>
                  <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    Click to see question
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Status Badge */}
          {cardStatus && (
            <div className="flex justify-center">
              <span
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  ${cardStatus === 'learned'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }
                `}
              >
                {cardStatus === 'learned' ? <FiCheck /> : <FiClock />}
                {cardStatus === 'learned' ? 'Learned' : 'Review Later'}
              </span>
            </div>
          )}

          {/* Navigation & Actions */}
          <div className="flex flex-col gap-4">
            {/* Mark Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="success"
                onClick={markAsLearned}
                icon={<FiCheck />}
                disabled={cardStatus === 'learned'}
              >
                Mark as Learned
              </Button>
              <Button
                variant="secondary"
                onClick={markForReview}
                icon={<FiClock />}
                disabled={cardStatus === 'review'}
              >
                Review Later
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                icon={<FiChevronLeft />}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExport}
                  icon={<FiDownload />}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  icon={<FiRefreshCw />}
                >
                  Regenerate
                </Button>
              </div>

              <Button
                variant="secondary"
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
              >
                Next
                <FiChevronRight />
              </Button>
            </div>
          </div>
        </>
      )}

      {!notesText && !isGenerating && !flashcards.length && (
        <Card className="text-center text-gray-500 dark:text-gray-400">
          <p>Upload your notes in the Upload tab to get started</p>
        </Card>
      )}
    </div>
  );
}
