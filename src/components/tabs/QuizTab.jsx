import { useState } from 'react';
import { FiRefreshCw, FiDownload } from 'react-icons/fi';
import { useApp } from '../../contexts/AppContext';
import { generateQuiz } from '../../utils/openai';
import { exportQuizResultsAsPDF } from '../../utils/export';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import Card from '../Card';

export default function QuizTab({ showToast }) {
  const { notesText, apiKey, addQuizResult } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

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
      const quiz = await generateQuiz(notesText, numQuestions, apiKey);
      setQuestions(quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowResults(false);
      showToast(`Quiz with ${quiz.length} questions generated!`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < questions.length) {
      showToast('Please answer all questions before submitting', 'warning');
      return;
    }
    
    const score = questions.reduce((acc, q, idx) => {
      return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);

    addQuizResult({
      date: new Date().toISOString(),
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100)
    });

    setShowResults(true);
    showToast(`Quiz completed! Score: ${score}/${questions.length}`, 'success');
  };

  const handleRetry = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const handleExport = () => {
    try {
      const score = questions.reduce((acc, q, idx) => {
        return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0);
      exportQuizResultsAsPDF(questions, userAnswers, score);
      showToast('Quiz results exported as PDF!', 'success');
    } catch (error) {
      showToast('Failed to export results', 'error');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];
  const isAnswered = selectedAnswer !== undefined;

  const calculateScore = () => {
    return questions.reduce((acc, q, idx) => {
      return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz yourself
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          See how much you actually remember
        </p>
      </div>

      {/* Quiz Setup */}
      {!questions.length && !isGenerating && (
        <Card>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Number of Questions
          </label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[5, 10, 15].map((num) => (
              <button
                key={num}
                onClick={() => setNumQuestions(num)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${numQuestions === num
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }
                `}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{num}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">questions</div>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!notesText}
              icon={<FiRefreshCw />}
            >
              Generate Quiz
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card className="text-center">
          <LoadingSpinner size="lg" text="Creating quiz questions..." />
        </Card>
      )}

      {/* Quiz Questions */}
      {questions.length > 0 && !isGenerating && !showResults && (
        <>
          {/* Progress */}
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Answered: {Object.keys(userAnswers).length}/{questions.length}</span>
          </div>

          {/* Question Card */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {currentQuestion.question}
              </h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const optionLetter = option.charAt(0);
                  const isSelected = selectedAnswer === optionLetter;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(optionLetter)}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all
                        ${isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  variant="success"
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length < questions.length}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Results */}
      {showResults && (
        <>
          {/* Score Card */}
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Completed!
            </h3>
            <div className="text-6xl font-bold text-blue-600 my-6">
              {calculateScore()}/{questions.length}
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {Math.round((calculateScore() / questions.length) * 100)}% Score
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleRetry} icon={<FiRefreshCw />}>
                Retry Quiz
              </Button>
              <Button variant="secondary" onClick={handleExport} icon={<FiDownload />}>
                Export Results
              </Button>
              <Button onClick={handleGenerate} icon={<FiRefreshCw />}>
                New Quiz
              </Button>
            </div>
          </Card>

          {/* Review Answers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Review Your Answers
            </h3>
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <Card key={idx}>
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold
                      ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}
                    `}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">
                        Q{idx + 1}: {q.question}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Correct answer: <span className="text-green-600">{q.correctAnswer}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {!notesText && !isGenerating && !questions.length && (
        <Card className="text-center text-gray-500 dark:text-gray-400">
          <p>Upload your notes in the Upload tab to get started</p>
        </Card>
      )}
    </div>
  );
}
