// ============================================================
//  useDebounce – delays updating a value until input settles
// ============================================================
import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value`.
 * Updates only after the user has stopped typing for `delay` ms.
 *
 * @param {any}    value – the value to debounce (e.g. a search string)
 * @param {number} delay – debounce delay in ms (default 500)
 * @returns {any} the debounced value
 *
 * Usage:
 *   const debouncedQuery = useDebounce(searchInput, 500);
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel previous timer if value changes before delay fires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
