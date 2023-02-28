export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @template T
 * @param {!function(...T)} func 
 * @param {!number} waitInMs 
 * @returns {function(...T)}
 */
export function debounce(func, waitInMs) {
  let timeout = null;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, waitInMs);
  };
}