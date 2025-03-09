import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAuthError } from '../utils/errorMessages';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { resetPassword } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage(`Password reset email sent to ${email}. Click the link in the email to reset your password.`);
    } catch (error) {
      setError(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Password</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-start">
          <div className="mr-3 flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            {error}
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
              <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                <h4 className="font-medium text-green-800">What happens next:</h4>
                <ol className="list-decimal ml-5 mt-1 text-sm text-green-700 space-y-1">
                  <li>Check your email for a message from "We Are Geniuses"</li>
                  <li>Click the password reset link in the email</li>
                  <li>Follow the instructions to create a new password</li>
                  <li>After reset, you'll be able to log in with your new password</li>
                </ol>
              </div>
              <div className="mt-2">
                <p className="text-sm">Didn't receive the email? Check your spam folder or <button onClick={() => handleSubmit({ preventDefault: () => {} })} className="text-primary-600 hover:text-primary-800 underline">try again</button>.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!message && (
        <div className="relative rounded-lg overflow-hidden mb-4">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <form onSubmit={handleSubmit} className="relative px-8 pt-6 pb-8">
            <div className="mb-2">
              <p className="text-gray-600 text-sm mb-4">
                Enter your email address below and we'll send you instructions to reset your password.
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button
                className="bg-gradient-button-orange text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-transform duration-300 transform hover:scale-105"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Password Reset Email'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword; 