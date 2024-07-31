// components/ErrorDialog.js
import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';


const ErrorDialog = ({ message }) => {

  return (
    <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg top-0 absolute right-0" role="alert">
      <FaExclamationCircle className="w-5 h-5 mr-2 text-red-700" />
      <span className="font-medium">{message}</span>
    </div>
  );

}


  


  

export default ErrorDialog;
