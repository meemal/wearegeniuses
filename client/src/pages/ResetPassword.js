import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../services/firebase';
import { formatAuthError } from '../utils/errorMessages';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading to show spinner 
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [validCode, setValidCode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the oobCode (action code) from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');

    if (!oobCode) {
      setError('Invalid or missing reset code. Please try the reset link from your email again or request a new one.');
      setLoading(false);
      return;
    }

    // Verify the action code
    const verifyCode = async () => {
      try {
        // This will throw an error if the code is invalid
        const email = await verifyPasswordResetCode(auth, oobCode);
        setEmail(email);
        setValidCode(true);
      } catch (error) {
        console.error('Error verifying reset code:', error);
        setError(formatAuthError(error));
        setValidCode(false);
      } finally {
        setLoading(false);
      }
    };

    verifyCode();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password should be at least 6 characters long');
    }

    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');

    try {
      setError('');
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, password);
      setMessage('Your password has been reset successfully. You can now log in with your new password.');
      
      // Automatically redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle cases where the user came to this page without a valid reset code
  const handleRequestNewLink = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Your Password</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-start">
          <div className="mr-3 flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            {error}
            {!validCode && (
              <div className="mt-2">
                <button
                  onClick={handleRequestNewLink}
                  className="text-red-700 font-medium hover:underline"
                >
                  Request a new reset link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {message && (
        <div className="relative rounded-lg overflow-hidden mb-4">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <div className="relative p-6 text-green-700 flex items-start">
            <div className="mr-3 flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              {message}
              <div className="mt-2">
                <p className="text-sm">Redirecting you to the login page in a few seconds...</p>
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                  Go to Login Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && !error && !message && (
        <div className="relative rounded-lg overflow-hidden mb-4">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <div className="relative p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Verifying your reset link...</p>
          </div>
        </div>
      )}

      {validCode && !message && !loading && (
        <div className="relative rounded-lg overflow-hidden mb-4">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <form onSubmit={handleSubmit} className="relative px-8 pt-6 pb-8">
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Setting new password for <span className="font-medium">{email}</span>
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-gradient-button-pink text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-transform duration-300 transform hover:scale-105"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!validCode && !loading && !error && (
        <div className="relative rounded-lg overflow-hidden mb-4">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <div className="relative p-6">
            <h3 className="font-bold text-yellow-700">Invalid Reset Link</h3>
            <p className="mt-2 text-yellow-700">The password reset link is invalid or has expired. Please request a new one.</p>
            <div className="mt-4">
              <button 
                onClick={handleRequestNewLink}
                className="bg-gradient-button-orange text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform duration-300 transform hover:scale-105"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword; 