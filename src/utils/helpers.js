/**
 * Formats a number as an Indian Rupee currency string
 * @param {number} amount 
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount === 0) return 'FREE';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats a date string for better display
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Generates a random popularity count for demo purposes
 * @param {number} eventId 
 * @returns {number}
 */
export const getPopularityCount = (eventId) => {
  // Purely for UI demonstration to "impress"
  return Math.floor(((eventId * 153) % 45) + 12);
};
