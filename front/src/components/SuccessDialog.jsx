
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessDialog = ({ message }) => (
  <div className="flex z-50 bottom-0 items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg absolute right-2" role="alert">
    <FaCheckCircle className="w-5 h-5 mr-2 text-green-700" />
    <span className="font-medium">{message}</span>

    
  </div>
);

export default SuccessDialog;
