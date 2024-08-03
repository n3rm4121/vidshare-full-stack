import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { IoCloseCircle } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import Spinner from "./Spinner";

const UploadStatusDialog = () => {
  const [isVisible, setIsVisible] = useState(true);
  const uploadStatus = useSelector(state => state.user.uploadStatus);
  const isLoading = uploadStatus.loading;

  useEffect(() => {
    if (uploadStatus.message) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [uploadStatus.message]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="fixed bottom-4 right-4 bg-white p-4 border rounded-lg shadow-lg z-50">
        {isLoading ? (
          <div className="text-gray-700 flex justify-center items-center gap-2">
            <p className="text-xl">Video Uploading</p>
            <Spinner className='inline p-0 m-0' size={30} />
          </div>
        ) : (
          uploadStatus.message && (
            <div onClick={handleClose} className="flex items-center cursor-pointer">
              <p className={`flex-grow ${uploadStatus.message.includes('successfully') ? 'text-green-500' : 'text-red-500'} text-xl`}>
                {uploadStatus.message}
              </p>
              <button  className="ml-2">
                {uploadStatus.message.includes('successfully') ? (
                  <MdVerified size={20} className="text-green-600" />
                ) : (
                  <IoCloseCircle size={20} className="text-red-600" />
                )}
              </button>
            </div>
          )
        )}
      </div>
    )
  );
};

export default UploadStatusDialog;
