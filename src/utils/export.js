import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

/**
 * Export summary as PDF
 * @param {string} summary - The summary text to export
 * @param {string} title - The title of the PDF
 */
export function exportSummaryAsPDF(summary, title = 'Study Notes Summary') {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Add summary content
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(summary, 170);
  doc.text(lines, 20, 40);
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}

/**
 * Export flashcards as CSV
 * @param {Array} flashcards - Array of flashcard objects
 */
export function exportFlashcardsAsCSV(flashcards) {
  // Create CSV content
  const headers = ['Question', 'Answer'];
  const rows = flashcards.map(card => [
    `"${card.question.replace(/"/g, '""')}"`,
    `"${card.answer.replace(/"/g, '""')}"`
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `flashcards_${Date.now()}.csv`);
}

/**
 * Export quiz results as PDF
 * @param {Array} questions - Array of quiz questions
 * @param {Array} userAnswers - Array of user's answers
 * @param {number} score - Final score
 */
export function exportQuizResultsAsPDF(questions, userAnswers, score) {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Quiz Results', 20, yPosition);
  yPosition += 10;
  
  // Add score
  doc.setFontSize(14);
  doc.text(`Score: ${score}/${questions.length} (${Math.round((score / questions.length) * 100)}%)`, 20, yPosition);
  yPosition += 15;
  
  // Add questions and answers
  doc.setFontSize(10);
  questions.forEach((q, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Question
    doc.setFont('helvetica', 'bold');
    const questionLines = doc.splitTextToSize(`Q${index + 1}: ${q.question}`, 170);
    doc.text(questionLines, 20, yPosition);
    yPosition += questionLines.length * 5 + 3;
    
    // User's answer
    doc.setFont('helvetica', 'normal');
    const userAnswer = userAnswers[index] || 'Not answered';
    const isCorrect = userAnswer === q.correctAnswer;
    doc.setTextColor(isCorrect ? 0 : 255, isCorrect ? 128 : 0, 0);
    doc.text(`Your answer: ${userAnswer} ${isCorrect ? '✓' : '✗'}`, 20, yPosition);
    yPosition += 5;
    
    // Correct answer
    doc.setTextColor(0, 0, 0);
    doc.text(`Correct answer: ${q.correctAnswer}`, 20, yPosition);
    yPosition += 8;
  });
  
  doc.save(`quiz_results_${Date.now()}.pdf`);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
