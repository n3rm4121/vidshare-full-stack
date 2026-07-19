import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPrompt = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold mb-2">Sign in to continue</h2>
        <p className="text-gray-500 mb-6">You need to be signed in to do that.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
