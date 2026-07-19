import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axiosInstance from '../utils/axiosInstance';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.post('/users/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 relative">
      <Link to="/login" className="absolute top-4 left-4 flex items-center gap-1 text-gray-600 hover:text-gray-900 transition">
        <IoArrowBack size={18} />
        <span className="text-sm font-medium">Back to login</span>
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <Link to="/">
          <h1 className="text-3xl font-bold text-primary mb-1 hover:opacity-80 transition">VidShare</h1>
        </Link>
        <h2 className="text-xl font-semibold mb-1">Forgot your password?</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

        {submitted ? (
          <div className="text-center">
            <div className="text-green-600 font-medium mb-2">Check your inbox!</div>
            <p className="text-gray-500 text-sm">
              If <span className="font-medium">{email}</span> is registered, a password reset link has been sent. It expires in 1 hour.
            </p>
            <Link to="/login" className="mt-6 inline-block text-primary hover:underline text-sm">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
