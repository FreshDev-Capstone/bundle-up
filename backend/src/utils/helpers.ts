/**
 * @fileoverview Helper utility functions
 * @description Common utility functions used throughout the application
 */

/**
 * Generates a random string of specified length
 * @function generateRandomString
 * @description Creates a cryptographically secure random string
 * 
 * @param {number} length - Length of the random string to generate
 * @returns {string} Random string
 * 
 * @example
 * const randomId = generateRandomString(16);
 * console.log(randomId); // "a1b2c3d4e5f6g7h8"
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Generates a unique ID with prefix
 * @function generateId
 * @description Creates a unique identifier with a specified prefix
 * 
 * @param {string} prefix - Prefix for the ID (e.g., 'user', 'prod')
 * @param {number} length - Length of the random part (default: 8)
 * @returns {string} Unique ID with prefix
 * 
 * @example
 * const userId = generateId('user', 12);
 * console.log(userId); // "user_a1b2c3d4e5f6"
 * 
 * const productId = generateId('prod');
 * console.log(productId); // "prod_a1b2c3d4"
 */
export const generateId = (prefix: string, length: number = 8): string => {
  const randomPart = generateRandomString(length);
  return `${prefix}_${randomPart}`;
};

/**
 * Generates a UUID v4
 * @function generateUUID
 * @description Creates a UUID v4 compliant string
 * 
 * @returns {string} UUID v4 string
 * 
 * @example
 * const uuid = generateUUID(); // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Formats a date to ISO string
 * @function formatDate
 * @description Converts a date to ISO string format
 * 
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 * 
 * @example
 * const now = new Date();
 * const formatted = formatDate(now);
 * console.log(formatted); // "2025-06-22T01:41:49.501Z"
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Formats a price to currency string
 * @function formatPrice
 * @description Converts a number to currency format
 * 
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted price string
 * 
 * @example
 * const price = formatPrice(7.99);
 * console.log(price); // "$7.99"
 * 
 * const euroPrice = formatPrice(5.50, 'EUR');
 * console.log(euroPrice); // "€5.50"
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  
  return formatter.format(price);
};

/**
 * Formats a number as currency with locale support
 * @function formatCurrency
 * @description Converts a number to a formatted currency string
 * 
 * @param {number} amount - Amount to format
 * @param {string} [currency='USD'] - Currency code
 * @param {string} [locale='en-US'] - Locale for formatting
 * @returns {string} Formatted currency string
 * 
 * @example
 * const price = formatCurrency(19.99); // "$19.99"
 * const euro = formatCurrency(15.50, 'EUR', 'de-DE'); // "15,50 €"
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Capitalizes the first letter of a string
 * @function capitalize
 * @description Makes the first character uppercase
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 * 
 * @example
 * const name = capitalize('john');
 * console.log(name); // "John"
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 * @function toTitleCase
 * @description Converts a string to title case (first letter of each word capitalized)
 * 
 * @param {string} str - String to convert
 * @returns {string} Title case string
 * 
 * @example
 * const title = toTitleCase('hello world');
 * console.log(title); // "Hello World"
 * 
 * const productName = toTitleCase('organic brown eggs');
 * console.log(productName); // "Organic Brown Eggs"
 */
export const toTitleCase = (str: string): string => {
  if (!str) return str;
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Truncates a string to specified length
 * @function truncate
 * @description Cuts a string to specified length and adds ellipsis if needed
 * 
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} Truncated string
 * 
 * @example
 * const short = truncate('This is a very long string', 10);
 * console.log(short); // "This is a..."
 * 
 * const long = truncate('Short string', 20);
 * console.log(long); // "Short string"
 */
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Validates if a string is a valid email
 * @function isValidEmail
 * @description Checks if a string matches email format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email, false otherwise
 * 
 * @example
 * const isValid = isValidEmail('user@example.com');
 * console.log(isValid); // true
 * 
 * const isInvalid = isValidEmail('invalid-email');
 * console.log(isInvalid); // false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes a string by removing HTML tags
 * @function sanitizeString
 * @description Removes HTML tags from a string for security
 * 
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 * 
 * @example
 * const clean = sanitizeString('<script>alert("xss")</script>Hello');
 * console.log(clean); // "Hello"
 */
export const sanitizeString = (str: string): string => {
  if (!str) return str;
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Debounces a function call
 * @function debounce
 * @description Delays function execution until after a specified delay
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 * 
 * // Call multiple times, only executes after 300ms of no calls
 * debouncedSearch('query1');
 * debouncedSearch('query2');
 * debouncedSearch('query3');
 * // Only query3 will execute
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttles a function call
 * @function throttle
 * @description Limits function execution to once per specified interval
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 * 
 * @example
 * const throttledScroll = throttle(scrollHandler, 100);
 * 
 * // Will only execute once per 100ms
 * window.addEventListener('scroll', throttledScroll);
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Paginates an array of items
 * @function paginateResults
 * @description Splits an array into pages with pagination metadata
 * 
 * @param {T[]} items - Array of items to paginate
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Object} Paginated results with metadata
 * 
 * @example
 * const results = paginateResults(products, 2, 5);
 * console.log(results);
 * // {
 * //   items: [...],
 * //   pagination: {
 * //     page: 2,
 * //     limit: 5,
 * //     total: 25,
 * //     totalPages: 5,
 * //     hasNext: true,
 * //     hasPrev: true
 * //   }
 * // }
 */
export const paginateResults = <T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);

  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

/**
 * Deep clones an object
 * @function deepClone
 * @description Creates a deep copy of an object
 * 
 * @param {T} obj - Object to clone
 * @returns {T} Deep cloned object
 * 
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * cloned.b.c = 3;
 * console.log(original.b.c); // 2 (unchanged)
 * console.log(cloned.b.c); // 3
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * Compares two objects for deep equality
 * @function deepEqual
 * @description Checks if two objects are deeply equal
 * 
 * @param {any} obj1 - First object to compare
 * @param {any} obj2 - Second object to compare
 * @returns {boolean} True if objects are deeply equal
 * 
 * @example
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { a: 1, b: { c: 2 } };
 * const obj3 = { a: 1, b: { c: 3 } };
 * 
 * console.log(deepEqual(obj1, obj2)); // true
 * console.log(deepEqual(obj1, obj3)); // false
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
} 