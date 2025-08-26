/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {any} value - The value to store
 */
export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve data from
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The stored value or default value
 */
export function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove
 */
export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearLocalStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Storage keys
export const STORAGE_KEYS = {
  API_KEY: 'studyai_api_key',
  THEME: 'studyai_theme',
  NOTES_TEXT: 'studyai_notes_text',
  FLASHCARDS: 'studyai_flashcards',
  FLASHCARD_PROGRESS: 'studyai_flashcard_progress',
  QUIZ_HISTORY: 'studyai_quiz_history',
  SUMMARY: 'studyai_summary',
};
