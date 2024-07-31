import React, { useState } from 'react';

const FileInput = ({ label, onFileChange, previewUrl, type }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center border border-gray-300 rounded-lg p-4 max-w-sm my-2 w-full">
      <div className="flex justify-center items-center w-full h-40 object-cover rounded-lg mb-4">
      
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className={`object-cover ${type === 'avatar' ? 'w-[150px] h-[150px] rounded-full border-4 border-green-600' : 'w-full h-32 rounded-lg'}`}
          />
        ) : (
          <div className="w-[150px] h-[150px] bg-gray-200 rounded-full border-4 flex text-gray-500 justify-center items-center">
            No Image
          </div>
        )}
      </div>

      <label className="block cursor-pointer mb-2">
        <span className="bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
          {label}
        </span>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    
      {fileName && (
        <p className="text-gray-700">{fileName}</p>
      )}
      {type === 'avatar' && (
        <div className="text-gray-700 text-sm p-3 mt-4 bg-gray-100 rounded-lg">
        <p>Recommended size: 150x150px</p>
        <p>Max file size: 4mb</p>
        <p>Allowed file types: jpeg, png, jpg</p>
       </div>

      )}

      {type === 'cover' && (
        <div className="text-gray-700 text-sm p-3 mt-4 bg-gray-100 rounded-lg">
        <p>Recommended size: 1200x400px</p>
        <p>Max file size: 6mb</p>
        <p>Allowed file types: jpeg, png, jpg</p>
        </div>

      )}



      
      
    </div>
  );
};

export default FileInput;
