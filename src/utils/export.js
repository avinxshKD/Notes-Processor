import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export function exportSummaryAsPDF(summary, title = 'Study Notes Summary') {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(summary, 170), 20, 40);

  doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}

export function exportFlashcardsAsCSV(flashcards) {
  const escape = s => `"${s.replace(/"/g, '""')}"`;
  const csv = [
    'Question,Answer',
    ...flashcards.map(c => `${escape(c.question)},${escape(c.answer)}`)
  ].join('\n');

  saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `flashcards_${Date.now()}.csv`);
}

export function exportQuizResultsAsPDF(questions, userAnswers, score) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Quiz Results', 20, y);
  y += 10;

  doc.setFontSize(14);
  doc.text(`Score: ${score}/${questions.length} (${Math.round((score / questions.length) * 100)}%)`, 20, y);
  y += 15;

  doc.setFontSize(10);
  questions.forEach((q, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    const qLines = doc.splitTextToSize(`Q${i + 1}: ${q.question}`, 170);
    doc.text(qLines, 20, y);
    y += qLines.length * 5 + 3;

    doc.setFont('helvetica', 'normal');
    const answer = userAnswers[i] || 'Not answered';
    const correct = answer === q.correctAnswer;
    doc.setTextColor(correct ? 0 : 255, correct ? 128 : 0, 0);
    doc.text(`Your answer: ${answer} ${correct ? '✓' : '✗'}`, 20, y);
    y += 5;

    doc.setTextColor(0, 0, 0);
    doc.text(`Correct: ${q.correctAnswer}`, 20, y);
    y += 8;
  });

  doc.save(`quiz_results_${Date.now()}.pdf`);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
