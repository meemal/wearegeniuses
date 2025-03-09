/**
 * Helper functions to handle Firebase authentication errors
 * Maps Firebase error codes to user-friendly messages
 */

/**
 * Formats Firebase authentication errors into user-friendly messages
 * @param {Error} error - The Firebase error object
 * @returns {string} User-friendly error message
 */
export const formatAuthError = (error) => {
  if (!error) return 'An error occurred. Please try again.';
  
  // Get error code directly if available
  const errorCode = error.code || '';
  
  // Error mapping
  const errorMap = {
    // Registration & Login errors
    'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password with at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please check your email or register.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/invalid-credential': 'Invalid login credentials. Please check your email and password and try again.',
    'auth/invalid-login-credentials': 'Invalid login credentials. Please check your email and password and try again.',
    'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later or reset your password.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the sign in. Please try again.',
    'auth/requires-recent-login': 'This operation requires a more recent login. Please log out and log in again.',
    
    // Password reset specific errors
    'auth/expired-action-code': 'This password reset link has expired. Please request a new one.',
    'auth/invalid-action-code': 'This password reset link is invalid. It may have been used already or is malformed.',
    'auth/missing-continue-uri': 'The continue URL is missing from the password reset request. Please try again or contact support.',
    'auth/invalid-continue-uri': 'The continue URL in the password reset request is invalid. Please try again or contact support.',
    'auth/unauthorized-continue-uri': 'The domain of the continue URL is not allowed. Please contact support.',
    'auth/missing-ios-bundle-id': 'The iOS bundle ID is missing from the password reset request. Please try again or contact support.',
    'auth/missing-android-pkg-name': 'The Android package name is missing from the password reset request. Please try again or contact support.',
  };

  // If we have a direct match with the error code
  if (errorCode && errorMap[errorCode]) {
    return errorMap[errorCode];
  }
  
  // Try to extract error code from the message if not available directly
  if (error.message) {
    // Pattern 1: Firebase: Error (auth/error-code)
    const parenthesesMatch = error.message.match(/\(([^)]+)\)/);
    if (parenthesesMatch && parenthesesMatch[1] && errorMap[parenthesesMatch[1]]) {
      return errorMap[parenthesesMatch[1]];
    }
    
    // Pattern 2: auth/error-code
    for (const code in errorMap) {
      if (error.message.includes(code)) {
        return errorMap[code];
      }
    }
    
    // Pattern 3: FirebaseError: Firebase: Error message (auth/error-code).
    const fullRegexMatch = error.message.match(/FirebaseError: Firebase: (.*?) \((auth\/[^)]+)\)/);
    if (fullRegexMatch && fullRegexMatch[2] && errorMap[fullRegexMatch[2]]) {
      return errorMap[fullRegexMatch[2]];
    }
  }

  // If no specific mapping is found, return a generic message or the original message
  return error.message || 'An error occurred. Please try again.';
}; 