import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axiosInstance from '../utils/axiosInstance';

function ResetPassword() {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/users/reset-password/${userId}/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset link.');
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
        <h2 className="text-xl font-semibold mb-1">Set a new password</h2>
        <p className="text-gray-500 text-sm mb-6">Choose a strong password — at least 6 characters.</p>

        {done ? (
          <div className="text-center">
            <div className="text-green-600 font-medium mb-2">Password reset successfully!</div>
            <p className="text-gray-500 text-sm">Redirecting you to login…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
